import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { Button, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFlash } from 'react-icons/io5'

export const SwapConfirm = () => {
  const { t } = useTranslation()

  const { selectFromToken, selectToToken, gridWalletList } =
    useContext(SwapContext)
  const { isSwaping, isFinalTx, validateErr, onConfirm } =
    useContext(TxLogicContext)

  const unableTrade =
    !selectFromToken ||
    !selectToToken ||
    !gridWalletList.length ||
    !!validateErr.length

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

  return (
    <Button
      variant="contained"
      className="!mb-2 !rounded-full"
      onClick={onConfirm}
      disabled={isSwaping || isFinalTx || unableTrade}
    >
      {isSwaping ? (
        <CircularProgress size={16} className="mr-2"></CircularProgress>
      ) : (
        <IoFlash></IoFlash>
      )}
      <span className="ml-1">{text}</span>
    </Button>
  )
}
