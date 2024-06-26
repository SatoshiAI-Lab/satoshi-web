import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { OutlinedInput } from '@mui/material'
import { t } from 'i18next'
import { useContext } from 'react'

export const SelecSlippage = () => {
  const { selectFromToken, selectToToken } = useContext(SwapContext)
  const { isFinalTx, slippage, validateErr, setSlippage } =
    useContext(TxLogicContext)

  return (
    <div className="mt-5 flex">
      <div className="pb-5">
        <div className="font-bold mb-1">{t('slippage')}</div>
        <OutlinedInput
          className="!rounded-xl w-[110px]"
          classes={{
            input: '!py-0 !leading-none !block',
            root: '!pr-4',
          }}
          disabled={isFinalTx}
          type="number"
          size="small"
          placeholder={t('custom')}
          endAdornment={
            <div className="h-full leading-none py-[14px] text-sm border-l-2 text-nowrap pl-4">
              %
            </div>
          }
          value={slippage}
          onChange={({ target }) => setSlippage(Number(target.value))}
        ></OutlinedInput>
        {slippage < 0.05 ? (
          <div className="mt-1 text-yellow-500 text-sm">
            {t('slippage.warning')}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col justify-center ml-5 text-sm text-red-500 leading-6">
        {selectFromToken && selectToToken
          ? validateErr.map((error) => {
              return <div key={error.errorText}>{error.errorText}</div>
            })
          : null}
      </div>
    </div>
  )
}
