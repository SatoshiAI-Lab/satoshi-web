import { DialogHeader } from '@/components/dialog-header'
import { Dialog, DialogContent } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  show: boolean
  open: () => any
  hidden: () => any
}

export const DialogSelectToken = (props: Props) => {
  const { show, hidden } = props
  const { t } = useTranslation()

  return (
    <Dialog open={show} onClose={hidden}>
      <DialogHeader text={t('select.token')} onClose={hidden}></DialogHeader>

      <DialogContent>
        <div className="text-center">Coming soon</div>
      </DialogContent>
    </Dialog>
  )
}
