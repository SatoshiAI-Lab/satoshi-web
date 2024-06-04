import { ChatResponseWalletListToken, MultiChainCoin } from '@/api/chat/types'
import PercentTag from '@/components/percent-tag'
import { zeroAddr } from '@/config/address'
import { Platform } from '@/config/wallet'
import { useStorage } from '@/hooks/use-storage'
import { DialogContext } from '@/hooks/use-swap/use-dialog-select-token'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { utilFmt } from '@/utils/format'
import { utilSwap } from '@/utils/swap'
import { MenuItem, Avatar, Checkbox, FormControlLabel } from '@mui/material'
import { useContext, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IoCopyOutline } from 'react-icons/io5'

interface Props {
  setCreateWalletInfo: (info: any) => void
}

export const TokenList = ({ setCreateWalletInfo }: Props) => {
  const {
    selectToToken,
    selectFromToken,
    walletList,
    setSelectFromToken,
    setSelectToToken,
    setFromTokenList,
    setToTokenList,
  } = useContext(SwapContext)
  const { isSearch, searchTokens, selectChainId, isFrom, closeDialog } =
    useContext(DialogContext)

  const { t } = useTranslation()
  const { getSearchTokensSetting, setSerchTokensSetting } = useStorage()

  const [isIgnoreLowValue, setIsIgnoreLowValue] = useState(
    getSearchTokensSetting() === 'true'
  )

  const handleSearchTokensSetting = () => {
    const isIgnoreLowValue = getSearchTokensSetting() === 'true'
    setSerchTokensSetting(`${!isIgnoreLowValue}`)
    setIsIgnoreLowValue(!isIgnoreLowValue)
  }

  const myTokens = () => {
    const tokens: MultiChainCoin[] = []

    walletList.forEach((w) => {
      const tokneBalance = isIgnoreLowValue
        ? w.tokens?.filter((t) => {
            return t.value_usd! >= 1
          })
        : w.tokens

      tokneBalance?.forEach((t) => {
        const token = tokens.find(
          (token) =>
            token.address === t.address && token.chain.id === t.chain.id
        )

        if (token) {
          token.value_usd! += t.value_usd || 0
        } else {
          tokens.push({
            ...t,
            holders: 1000,
            is_supported: true,
            market_cap: '0',
            liquidity: '0',
          })
        }
      })
    })
    return utilSwap.sortByMarkeCap(tokens)
  }

  let tokens: any[] = isSearch ? searchTokens : myTokens() || []

  tokens = (tokens || [])
    .filter((t) => {
      const eqChain = t.chain.id === selectChainId
      // const eqAddress = t.address !== atherToken?.address
      return eqChain || selectChainId === '-1'
    })
    // 搜索的代币如果有余额则替换成钱包余额的代币
    .map((token) => {
      if (isSearch) {
        let activeToken: ChatResponseWalletListToken | undefined = undefined
        // 查找钱包
        walletList.forEach((w) => {
          if (token.chain.id != w?.chain?.id) return
          // 查找钱包内对应代币
          const t = w?.tokens?.find((t) => {
            return token.address === t.address && token.chain.id === t.chain.id
          })

          if (t) {
            if (!activeToken) {
              activeToken = { ...t, ...token }
            } else {
              activeToken.value_usd += t.value_usd
            }
          }
        })

        if (activeToken) return activeToken
      }
      return token
    })
    //  按照余额来排序搜索到的结果
    .sort((a, b) => {
      return (b.value_usd || 0) - (a.value_usd || 0)
    })

  const onSelectToken = (token: any) => {
    // 还没有创建对应平台的钱包
    if (!walletList.find((w) => w!.chain!.id === token.chain.id)) {
      return setCreateWalletInfo({
        actived: true,
        chainName: token.chain.name,
        platform: token.chain.name === 'solana' ? Platform.Sol : Platform.Evm,
        tokenName: token.symbol || token.name,
      })
    }

    const selectToken = isFrom ? selectToToken : selectFromToken

    // 交换的代币不可以一致
    if (
      token.address === selectToken?.address &&
      token.chain.id === selectToken?.chain.id
    ) {
      return toast.error(t('connot.exchange'))
    }

    if (isFrom) {
      // 余额不足
      if (!token.value_usd || token.value_usd < 0.1) {
        return toast.error(t('select.token.tips'))
      }
      setSelectFromToken(token)
      setFromTokenList([])
    } else {
      // 不支持跨链
      // if (token.chain.id !== selectToken?.chain.id) {
      //   return toast.error(t('error.chian'))
      // }
      setSelectToToken(token)
      setToTokenList([])
    }
    closeDialog()
  }

  return (
    <div className="mt-2 mb-4">
      {!isSearch && (
        <div className="pl-[25px] text-sm flex items-center">
          <FormControlLabel
            control={<Checkbox checked={isIgnoreLowValue} size="small" />}
            label={<span className="text-sm">{t('hide.low.value.token')}</span>}
            onClick={() => {
              handleSearchTokensSetting()
            }}
          />
        </div>
      )}
      {tokens.map((token) => {
        return (
          <MenuItem
            key={`${token.address}${token.chain.id}`}
            className="!px-6 !py-0"
          >
            <div
              className="w-full flex py-2 justify-between items-center"
              onClick={() => onSelectToken(token)}
            >
              <div className="flex">
                <Avatar src={token?.logo} className="w-[35px] h-[35px] mr-2">
                  {token?.symbol?.slice(0, 1)}
                </Avatar>
                <div className="">
                  <div className="flex items-center">
                    <div className="max-w-[120px] truncate">
                      {token?.symbol}
                    </div>
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
                  <div className="text-sm text-gray-400">
                    {utilFmt.fisrtCharUppercase(token?.chain.name)}
                  </div>
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
        )
      })}
    </div>
  )
}
