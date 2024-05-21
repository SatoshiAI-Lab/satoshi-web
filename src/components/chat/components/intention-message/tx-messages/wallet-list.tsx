import { useChainsPlatforms } from '@/components/wallet/hooks/use-chains-platforms'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { utilFmt } from '@/utils/format'
import { Select, MenuItem } from '@mui/material'
import clsx from 'clsx'
import React, { useContext } from 'react'
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
    setFromWallet,
    setReceiveWallet,
  } = useContext(SwapContext)

  const getCols = (count: number) => {
    if (count == 1) {
      return 'grid-cols-[128px]'
    }
    if (count == 2) {
      return 'grid-cols-[128px_128px]'
    }

    return 'grid-cols-[128px_128px_128px]'
  }

  const platform = chains.find(
    (c) => c.name === selectToToken?.chain.name
  )?.platform

  const isInequalityChain =
    selectFromToken?.chain.id !== selectToToken?.chain.id
  const walletLength = gridWalletList?.[0]?.length

  const getSelectTokenInfo = (wallet: PartialWalletRes) => {
    return wallet?.tokens?.find((t) => selectFromToken?.address == t.address)
  }

  const fromWalletList = () => {
    if (!selectFromToken) {
      return <></>
    }

    return (
      <div
        className={clsx(
          'flex gap-5 mt-3 pr-5',
          isFinalTx && 'pointer-events-none',
          !selectToToken && !selectFromToken ? 'mt-3' : 'mt-0'
        )}
      >
        {walletLength > 0 ? (
          <div>
            <div className={clsx('font-bold mb-1')}>
              {walletLength == 1
                ? t('tx.token.wallet.balance')
                : t('tx.token.text2')}
            </div>
            <div
              className={clsx('inline-flex border rounded-2xl overflow-hidden')}
            >
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
          </div>
        ) : null}
        {walletLength < 3 ? receiveWalletComp() : null}
      </div>
    )
  }

  const receiveWalletComp = () => {
    if (!isInequalityChain || !receiveWallet || !selectToToken) {
      return <></>
    }

    return (
      <div
        className={clsx(
          walletLength ? 'flex flex-col justify-stretch' : '',
          gridWalletList[0]?.length > 2 ? 'inline-flex mt-5' : ''
        )}
      >
        <div className="font-bold mb-1">
          {t('receive.wallet').replace('$1', selectToToken?.symbol || '')}
        </div>
        <Select
          defaultValue={receiveWallet.id}
          size="small"
          className={clsx('!h-full  !rounded-2xl input-border-gray-300')}
          disabled={isFinalTx}
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
    )
  }

  const onChangeToWallet = (w: PartialWalletRes) => {
    setReceiveWallet(w)
  }

  return (
    <div
      className={clsx(
        isInequalityChain && walletLength < 2 ? 'flex items-stretch' : ''
      )}
    >
      {fromWalletList()}
      {walletLength > 2 ? receiveWalletComp() : null}
    </div>
  )
}
