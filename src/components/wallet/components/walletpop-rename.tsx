import { FC, useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from '@mui/material'
import { TfiClose } from 'react-icons/tfi'
import toast from 'react-hot-toast'
import { t } from 'i18next'

import { useWalletStore } from '@/stores/use-wallet-store'
import { useShow } from '@/hooks/use-show'
import { useWallet } from '@/hooks/use-wallet'

import type { WalletDialogProps } from '../types'

const WalletRenamePop: FC<WalletDialogProps> = (props) => {
  const { open, onClose, title, onlyWalletRefetch } = props
  const [walletName, setWalletName] = useState('')
  const { currentWallet } = useWalletStore()
  const { renameWallet } = useWallet()
  const { open: openLoading, show, hidden: hiddenLoading } = useShow()

  const onRenameWallet = async (walletName: string) => {
    openLoading()
    try {
      await renameWallet(currentWallet?.id!, walletName)
      toast.success(t('wallet.rename-wallet.success'))
      onClose?.()
    } catch (error) {
      toast.error(t('wallet.error'))
    } finally {
      hiddenLoading()
      onlyWalletRefetch?.()
    }
  }

  useEffect(() => {
    setWalletName(currentWallet?.name!)
  }, [open])

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
            <TextField
              label={t('wallet.rename-wallet.name')}
              multiline
              rows={2}
              className="w-full"
              InputProps={{
                classes: {
                  root: 'w-full !rounded-xl !bg-white',
                },
              }}
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
            <div className="text-[#101010b2] text-sm w-full">
              {currentWallet?.address}
            </div>
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
              disabled={show || !walletName}
              onClick={() => onRenameWallet(walletName)}
              startIcon={show ? <CircularProgress size={16} /> : <></>}
            >
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletRenamePop }
