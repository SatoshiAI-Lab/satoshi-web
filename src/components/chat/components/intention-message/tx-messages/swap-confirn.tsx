import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-tx-from-token'
import { Button, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFlash } from 'react-icons/io5'

export const SwapConfirm = () => {
  const { t } = useTranslation()

  const { selectFromToken, selectToToken, gridWalletList } =
    useContext(SwapContext)
  const { isSwaping, isFinalTx, onConfirm } = useContext(TxLogicContext)

  const handleCrossChain = () => {
    if (
      selectToToken &&
      selectFromToken &&
      selectToToken?.chain.id !== selectFromToken?.chain.id
    ) {
      return t('not.cross.chain')
    }
  }

  const unableTrade =
    !selectFromToken || !selectToToken || !gridWalletList.length

  let text = t('confirm')
  const crossChain = handleCrossChain()

  if (isFinalTx) {
    text = t('tx.finally')
  }

  if (isSwaping) {
    text = t('tx.loading')
  }

  if (unableTrade) {
    text = t('unable.trade')
  }

  if (crossChain) {
    text = crossChain
  }
  
  return (
    <Button
      variant="contained"
      className="!mb-2 !rounded-full"
      onClick={onConfirm}
      disabled={isSwaping || isFinalTx || unableTrade || !!crossChain}
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
