import { useWalletStore } from '@/stores/use-wallet-store'
import { Button, Dialog, IconButton, TextField } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { WalletDialogProps } from './types'
import { TfiClose } from 'react-icons/tfi'
import toast from 'react-hot-toast'
import { t } from 'i18next'

const WalletDeletePop: FC<WalletDialogProps> = ({ open, onClose, title }) => {
  const { deleteWallet, getWallets, currentWallet } = useWalletStore()
  const userDeleteWallet = async () => {
    deleteWallet(currentWallet.id!)
      .then((res) => {
        if (res.msg === 'ok') {
          onClose?.()
          toast.success(t('wallet.delete-wallet.success'))
          getWallets()
        }
      })
      .catch(() => {
        toast.error(t('wallet.error'))
      })
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
              Cancel
            </Button>
            <Button
              variant="contained"
              className="!h-[50px] !text-[18px] !rounded-xl"
              fullWidth
              onClick={userDeleteWallet}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletDeletePop }
