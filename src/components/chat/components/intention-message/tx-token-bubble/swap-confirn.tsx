import { SwapContext, TxLogicContext } from '@/hooks/use-swap/context'
import { Button, CircularProgress } from '@mui/material'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { IoFlash } from 'react-icons/io5'

export const SwapConfirm = () => {
  const { t } = useTranslation()

  const { isSwaping, isFinalTx, onConfirm } = useContext(TxLogicContext)

  return (
    <Button
      variant="contained"
      className="!mb-2 !rounded-full"
      onClick={onConfirm}
      disabled={isSwaping || isFinalTx}
    >
      {isSwaping ? (
        <CircularProgress size={16} className="mr-2"></CircularProgress>
      ) : (
        <IoFlash></IoFlash>
      )}
      <span className="ml-1">
        {isFinalTx
          ? t('tx.finally')
          : isSwaping
          ? t('tx.loading')
          : t('confirm')}
      </span>
    </Button>
  )
}
