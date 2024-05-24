import React, { useContext } from 'react'
import clsx from 'clsx'

import { t } from 'i18next'
import { formatUnits } from 'viem'
import { utilFmt } from '@/utils/format'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext, rates } from '@/hooks/use-swap/use-swap-confirm-logic'

export const SelectAmount = () => {
  const {
    selectFromToken,
    fromWallet,
    gridWalletList,
    selectToToken,
    intentTokenInfo,
  } = useContext(SwapContext)
  const {
    isFinalTx,
    curRate,
    validateErr,
    handleRateClick,
    getSelectTokenInfo,
  } = useContext(TxLogicContext)

  const walletLength = gridWalletList[0]?.length
  const selectWalletToken = getSelectTokenInfo(fromWallet, selectFromToken)

  const handleFromTokenError = () => {
    if (selectWalletToken?.symbol === selectToToken?.symbol) {
      return <></>
    }

    if (!selectWalletToken && selectToToken) {
      return (
        <div className={clsx('text-sm text-red-500 mt-2')}>
          {t('not.find.token').replace(
            '$1',
            intentTokenInfo?.fromTokenInfo || ''
          )}
        </div>
      )
    }

    if (selectWalletToken && !selectWalletToken.value_usd) {
      return (
        <div className={clsx('text-sm text-red-500 mt-2')}>
          {t('insufficient.balance').replace(
            '$1',
            selectWalletToken?.symbol || intentTokenInfo?.fromTokenInfo || ''
          )}
        </div>
      )
    }
  }

  const handleToTokenError = () => {
    if (!selectToToken) {
      return (
        <div className={clsx('text-sm text-red-500 mt-2')}>
          {t('not.find.token').replace(
            '$1',
            intentTokenInfo?.toTokenInfo || ''
          )}
        </div>
      )
    }
  }

  return (
    <React.Fragment>
      {/* From的错误提示 */}
      {handleFromTokenError()}

      {/* To的错误提示 */}
      {handleToTokenError()}

      {walletLength ? (
        <div
          className={clsx(
            'flex items-center text-sm text-gray-500',
            isFinalTx && 'pointer-events-none',
            selectToToken ? 'mt-4' : 'mt-3'
          )}
        >
          <div className="inline-flex justify-start border rounded-xl overflow-hidden">
            {rates.map((rate, i) => {
              return (
                <div
                  key={i}
                  className={clsx(
                    'py-2 px-4 cursor-pointer transition-all hover:bg-slate-100',
                    rate == curRate ? '!bg-slate-200' : '',
                    i == 1 ? 'border-x' : ''
                  )}
                  onClick={() => handleRateClick(rate)}
                >
                  {rate}%
                </div>
              )
            })}
          </div>
          <div className="ml-2">
            {t('total')}
            {utilFmt.token(
              Number(
                formatUnits(
                  BigInt(selectWalletToken?.amount ?? 0),
                  selectWalletToken?.decimals ?? 0
                )
              )
            )}
            {selectWalletToken?.symbol}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  )
}
