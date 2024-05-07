import PercentTag from '@/components/percent-tag'
import { zeroAddr } from '@/config/address'
import { Platform } from '@/config/wallet'
import { DialogContext } from '@/hooks/use-swap/use-dialog-select-token'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { utilFmt } from '@/utils/format'
import { MenuItem, Avatar } from '@mui/material'
import { useContext } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoCopyOutline } from 'react-icons/io5'

export const TokenList = () => {
  const { selectToToken, walletList } = useContext(SwapContext)
  const {
    isSearch,
    searchTokens,
    selectChainId,
    selectWallet,
    isFrom,
    setCreateWalletInfo,
  } = useContext(DialogContext)

  const { t } = useTranslation()

  let tokens: any[] = isSearch ? searchTokens : selectWallet!.tokens

  tokens = (tokens || [])
    .filter((t) => t.chain.id === selectChainId || selectChainId === '-1')
    // 搜索的代币如果有余额则替换成钱包余额的代币
    .map((token) => {
      if (isSearch) {
        const t = selectWallet?.tokens.find((t) => {
          return token.address === t.address && token.chain.id === t.chain.id
        })
        if (t) return t
      }
      return token
    })
    //  按照余额来排序搜索到的结果
    .sort((a, b) => {
      return (b.value_usd || 0) - (a.value_usd || 0)
    })

  const onSelectToken = (token: any) => {
    if (isFrom) {
      // 余额不足
      if (!token.value_usd || token.value_usd < 0.1) {
        return toast.error(t('select.token.tips'))
      }
      // 跨链了
      if (token.chain.id !== selectToToken!.chain.id) {
        return toast.error(t('error.chian'))
      }
      // 还没有创建对应平台的钱包
      if (walletList.find((w) => w!.chain!.id === token.chain.id)) {
        return setCreateWalletInfo({
          actived: true,
          chainName: token.chain.id,
          platform: token.chain.name === 'solana' ? Platform.Sol : Platform.Evm,
          tokenName: token.symbol || token.name,
        })
      }
    } else {
    }
  }

  return (
    <div className="mt-2 mb-4">
      {tokens.map((token) => (
        <MenuItem className="!px-6">
          <div
            className="w-full flex justify-between items-center"
            onClick={() => onSelectToken(token)}
          >
            <div className="flex">
              <Avatar src={token?.logo} className="w-[35px] h-[35px] mr-2">
                {token?.symbol.slice(0, 1)}
              </Avatar>
              <div className="">
                <div className="flex items-center">
                  <div className="max-w-[120px] truncate">{token?.symbol}</div>
                  <div onClick={(e) => e.stopPropagation()}>
                    {token.address !== zeroAddr ? (
                      <CopyToClipboard
                        text={token.address}
                        onCopy={() => toast.success(t('copy-success'))}
                      >
                        <span className="ml-1 flex items-center text-sm text-gray-400 hover:text-gray-500">
                          {utilFmt.addr(token.address, 4)}
                          <IoCopyOutline className="ml-1"></IoCopyOutline>
                        </span>
                      </CopyToClipboard>
                    ) : null}
                  </div>
                </div>
                <div className="text-sm text-gray-400">{token?.chain.name}</div>
              </div>
            </div>
            <div className="flex">
              <div className="text-right">
                <div>${utilFmt.token(token?.value_usd ?? 0)}</div>
                <div className="flex text-sm text-gray-400">
                  ${utilFmt.token(token?.price_usd)}
                  <PercentTag
                    percent={token?.price_change_24h ?? 0}
                    className="ml-1 text-sm"
                  />
                  {/* {formatUnits(BigInt(token!.amount), token.decimals)} */}
                </div>
              </div>
            </div>
          </div>
        </MenuItem>
      ))}
    </div>
  )
}
