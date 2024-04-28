
import { useSwapWallet } from '@/hooks/use-swap/use-swap-wallet'
import { SwapContext, TxLogicContext } from '@/hooks/use-swap/context'
import { useWalletStore } from '@/stores/use-wallet-store'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { t } from 'i18next'
import numeral from 'numeral'
import { useContext } from 'react'
import { formatUnits } from 'viem'

const rates = [20, 50, 100]
export const SelectAmount = () => {
  const { selectFromToken } = useContext(SwapContext)
  const { isFinalTx, curRate, setCurRate, setBuyValue, getSelectTokenInfo } =
    useContext(TxLogicContext)

  const { currentWallet } = useSwapWallet()

  const selectWalletToken = getSelectTokenInfo(currentWallet, selectFromToken)

  const getTokenBalance = () => {
    return currentWallet?.tokens?.find(
      (t) => t.address === selectFromToken?.address
    )
  }

  const handleRateClick = (rate: number) => {
    const balance = getTokenBalance()

    if (!balance) return
    const { amount, decimals } = balance
    const balanceFmt = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )
    const buyAmount = BigNumber(balanceFmt).multipliedBy(rate / 100)
    setCurRate(rate)
    setBuyValue(+buyAmount.toFixed(5))
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
        {Number(
          numeral(
            formatUnits(
              BigInt(selectWalletToken?.amount ?? 0),
              selectWalletToken?.decimals ?? 0
            )
          ).format('0.0000')
        )}
        {selectWalletToken?.symbol}
      </div>
    </div>
  )
}
