import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { Button, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFlash } from 'react-icons/io5'
import { utilFmt } from '@/utils/format'
import BigNumber from 'bignumber.js'

export const SwapConfirm = () => {
  const { t } = useTranslation()

  const { selectFromToken, selectToToken, gridWalletList } =
    useContext(SwapContext)
  const {
    isSwaping,
    isFinalTx,
    validateErr,
    isInitCrossFee,
    validateCrossErr,
    isCrossFeeError,
    crossFeeData,
    onConfirm,
  } = useContext(TxLogicContext)

  const isCrossErr =
    (!!validateCrossErr.length || isInitCrossFee || isCrossFeeError) &&
    selectFromToken?.chain.id !== selectToToken?.chain.id

  const unableTrade =
    !selectFromToken ||
    !selectToToken ||
    !gridWalletList.length ||
    !!validateErr.length ||
    isCrossErr

  let text = t('confirm')

  if (isFinalTx) {
    text = t('tx.finally')
  }

  if (isSwaping) {
    text = t('tx.loading')
  }

  if (unableTrade) {
    text = t('unable.trade')
  }

  if (isInitCrossFee) {
    text = t('cross.chain.quote')
  }

  const handleCrossPlatform = () => {
    const { provider, provider_data } = crossFeeData || {}

    if (selectFromToken?.chain.id === selectToToken?.chain.id) {
      return <></>
    }

    if (isCrossFeeError || validateCrossErr.length) {
      // if (crossFeeLoading) {
      //   return (
      //     <div className="mt-2 text-sm text-gray-500 flicker-text">
      //       {t('cross.chain.quote')}
      //     </div>
      //   )
      // }

      return (
        <div className="mt-2 text-sm text-red-500">
          {validateCrossErr.length
            ? validateCrossErr.map((item) => (
                <div key={item.type}>{item.errorText}</div>
              ))
            : t('cross.chain.error')}
        </div>
      )
    }

    return (
      <>
        {Number(provider_data?.cross_chain_fee) ? (
          <div className="mt-2 text-sm text-gray-500">
            {t('cross.fee.tips')
              .replace('$1', utilFmt.fisrtCharUppercase(provider) || '')
              .replace(
                '$2',
                `${utilFmt.token(
                  Number(provider_data?.cross_chain_fee) || 0,
                  2
                )}${provider_data?.cross_chain_fee_token?.symbol}`
              )
              .toString()
              .replace('$3', selectFromToken?.symbol || '')}
          </div>
        ) : null}
        {Number(provider_data?.estimate_gain_amount) ? (
          <div className="mt-2 text-sm text-gray-500">
            {t('cross.fee.estimate').replace(
              '$1',
              `${utilFmt.token(
                Number(provider_data?.estimate_gas_costs_amount) || 0,
                2
              )}${provider_data?.estimate_gas_costs_symbol} ≈ $${utilFmt.token(
                BigNumber(selectFromToken?.price_usd || 0)
                  .multipliedBy(provider_data?.estimate_gas_costs_amount || 0)
                  .toString()
              )}`
            )}
          </div>
        ) : null}
      </>
    )
  }

  return (
    <>
      <Button
        variant="contained"
        className="!mb-2 !rounded-full"
        onClick={onConfirm}
        disabled={isSwaping || isFinalTx || unableTrade}
      >
        {isSwaping || isInitCrossFee ? (
          <CircularProgress size={16} className="mr-2"></CircularProgress>
        ) : (
          <IoFlash></IoFlash>
        )}
        <span className="ml-1">{text}</span>
      </Button>
      {handleCrossPlatform()}
    </>
  )
}
