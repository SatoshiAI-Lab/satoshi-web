import { useChainsPlatforms } from '@/components/wallet/hooks/use-chains-platforms'
import { Platform } from '@/config/wallet'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-tx-logic'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { utilFmt } from '@/utils/format'
import { Select, MenuItem } from '@mui/material'
import clsx from 'clsx'
import numeral from 'numeral'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'

export const WalletList = () => {
  const { t } = useTranslation()
  const { isFinalTx } = useContext(TxLogicContext)
  const { chains } = useChainsPlatforms()
  const {
    gridWalletList,
    walletPlatform,
    receiveWallet,
    selectFromToken,
    fromWallet,
    selectToToken,
    intentTokenInfo,
    toTokenList,
    setFromWallet,
    setReceiveWallet,
  } = useContext(SwapContext)

  const getCols = (count: number) => {
    if (count == 1) {
      return 'grid-cols-[135px]'
    }
    if (count == 2) {
      return 'grid-cols-[135px_135px]'
    }

    return 'grid-cols-[135px_135px_135px]'
  }

  const platform = chains.find(
    (c) => c.name === selectToToken?.chain.name
  )?.platform

  const isSomeChian = selectFromToken?.chain.id !== selectToToken?.chain.id

  const getSelectTokenInfo = (wallet: PartialWalletRes) => {
    return wallet?.tokens?.find((t) => selectFromToken?.address == t.address)
  }

  const fromWalletList = () => {
    const walletLength = gridWalletList?.[0]?.length

    if (!walletLength || !toTokenList?.length) {
      return (
        <div className="text-sm text-red-500">
          {!walletLength ? (
            <div>
              {t('insufficient.balance').replace(
                '$1',
                selectFromToken?.symbol || intentTokenInfo?.fromTokenInfo || ''
              )}
            </div>
          ) : null}
          {!toTokenList?.length && !selectToToken ? (
            <div className="mt-1">
              {t('not.find.token').replace(
                '$1',
                intentTokenInfo?.toTokenInfo || ''
              )}
            </div>
          ) : null}
        </div>
      )
    }

    return (
      <>
        <div className="font-bold mb-1 ">
          {walletLength == 1
            ? t('tx.token.wallet.balance')
            : t('tx.token.text2')}
        </div>
        <div className={clsx('inline-flex border rounded-2xl overflow-hidden')}>
          {gridWalletList.map((wallets, i) => {
            return (
              <div
                key={i}
                className={clsx(
                  'grid border-neutral-300',
                  i !== 0 ? 'border-t' : '',
                  getCols(wallets.length)
                )}
              >
                {wallets.map((wallet, i) => {
                  const toeknInfo = getSelectTokenInfo(wallet)
                  return (
                    <div
                      key={i}
                      className={clsx(
                        'p-3 transition-all hover:text-gray-500 cursor-pointer',
                        fromWallet?.id == wallet.id
                          ? '!text-primary bg-slate-100'
                          : '',
                        i === 1 ? 'border-x' : '',
                        i === wallets.length - 1 ? '!border-r-0' : ''
                      )}
                      onClick={() => {
                        setFromWallet(wallet)
                      }}
                    >
                      <div className="truncate">{wallet.name}</div>
                      <div className="text-sm text-gray-500">
                        {utilFmt.token(
                          Number(
                            formatUnits(
                              BigInt(toeknInfo?.amount ?? 0),
                              toeknInfo?.decimals ?? 0
                            )
                          ),
                          2
                        )}
                        {toeknInfo?.symbol}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const onChangeToWallet = (w: PartialWalletRes) => {
    setReceiveWallet(w)
  }

  return (
    <div className={clsx('mt-5', isSomeChian ? 'flex items-stretch' : '')}>
      <div className={clsx('pr-5', isFinalTx && 'pointer-events-none')}>
        {fromWalletList()}
      </div>
      {isSomeChian && receiveWallet ? (
        <div
          className={clsx(
            'flex flex-col justify-stretch',
            gridWalletList[0].length > 2 ? 'mt-5' : ''
          )}
        >
          <div className="font-bold mb-1">
            {t('receive.wallet').replace('$1', selectToToken?.symbol || '')}
          </div>
          <Select
            defaultValue={receiveWallet.id}
            size="small"
            className={clsx('!h-full  !rounded-2xl input-border-gray-300')}
          >
            {walletPlatform![platform!]?.map((wallet) => {
              return (
                <MenuItem
                  key={wallet.id}
                  selected={receiveWallet.id === wallet.id}
                  value={wallet.id}
                  onClick={() => onChangeToWallet(wallet)}
                >
                  <div>
                    <div className="max-w-[130px] truncate">{wallet.name}</div>
                    <div className="text-sm text-gray-400">
                      <div>{utilFmt.addr(wallet.address, 4)}</div>
                    </div>
                  </div>
                </MenuItem>
              )
            })}
          </Select>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
