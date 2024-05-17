import { TxLogicContext, rates } from '@/hooks/use-swap/use-swap-confirm-logic'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { t } from 'i18next'
import numeral from 'numeral'
import { useContext } from 'react'
import { formatUnits } from 'viem'
import { utilFmt } from '@/utils/format'

export const SelectAmount = () => {
  const { selectFromToken, fromWallet, gridWalletList } =
    useContext(SwapContext)
  const { isFinalTx, curRate, handleRateClick, getSelectTokenInfo } =
    useContext(TxLogicContext)

  const walletLength = gridWalletList[0]?.length
  const selectWalletToken = getSelectTokenInfo(fromWallet, selectFromToken)

  if (!walletLength) {
    return <></>
  }

  return (
    <div
      className={clsx(
        'flex items-center mt-3 text-sm text-gray-500',
        isFinalTx && 'pointer-events-none'
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
  )
}
