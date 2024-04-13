import { FC } from 'react'
import { Button, CircularProgress, Dialog, IconButton } from '@mui/material'
import { TfiClose } from 'react-icons/tfi'
import toast from 'react-hot-toast'
import { t } from 'i18next'

import { useWalletStore } from '@/stores/use-wallet-store'
import { useShow } from '@/hooks/use-show'
import { useWallet } from '@/hooks/use-wallet'

import type { WalletDialogProps } from '../types'

const WalletDeletePop: FC<WalletDialogProps> = (props) => {
  const { open, onClose, title, onlyWalletRefetch } = props
  const { currentWallet } = useWalletStore()
  const { removeWallet } = useWallet()
  const { show, open: openLoading, hidden: hiddenLoading } = useShow()

  const onRemoveWallet = async () => {
    openLoading()

    try {
      await removeWallet(currentWallet?.id!)
      toast.success(t('wallet.delete-wallet.success'))
      onClose?.()
    } catch (error) {
      toast.error(t('wallet.error'))
    } finally {
      hiddenLoading()
      onlyWalletRefetch?.()
    }
  }

  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '10px' } }}
    >
      <div className="w-[500px]">
        <div className="h-[66px] border-b-2 flex justify-center items-center text-xl">
          <div>{title}</div>
          <IconButton
            classes={{
              root: '!absolute !w-[35px] !h-[35px] !right-5',
            }}
            onClick={onClose}
          >
            <TfiClose size={35} />
          </IconButton>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center m-auto py-16 gap-1 px-10">
            <div className="w-full">{t('wallet.deletewallet')}</div>
          </div>
          <div className="h-[80px] px-14 gap-5 border-t-2 flex justify-center items-center w-full">
            <Button
              variant="outlined"
              fullWidth
              className="!h-[50px] !text-[18px] !rounded-xl !border-black"
              classes={{ root: '!text-black' }}
              onClick={onClose}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              className="!h-[50px] !text-[18px] !rounded-xl"
              fullWidth
              onClick={onRemoveWallet}
              disabled={show}
            >
              {show && (
                <CircularProgress size={16} className="mr-2"></CircularProgress>
              )}
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletDeletePop }
