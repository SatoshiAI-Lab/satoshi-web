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
import { useTranslation } from 'react-i18next'

import type { WalletDialogProps } from '../types'

import { useWalletStore } from '@/stores/use-wallet-store'
import { useShow } from '@/hooks/use-show'
import { useWalletManage } from '@/hooks/use-wallet'
import { useUserStore } from '@/stores/use-user-store'

export const WalletRenamePop: FC<WalletDialogProps> = (props) => {
  const { open, onClose, title, onlyWalletRefetch } = props
  const { t } = useTranslation()
  const [walletName, setWalletName] = useState('')
  const { currentWallet } = useWalletStore()
  const { renameWallet, checkName } = useWalletManage()
  const { userInfo } = useUserStore()
  const { open: openLoading, show, hidden: hiddenLoading } = useShow()

  const checkNameIsExisted = async () => {
    const loadingId = toast.loading(t('check-name.loading'))
    try {
      const { data } = await checkName({
        id: userInfo?.id!,
        name: walletName,
      })

      if (data.result) {
        toast.error(t('check-name.existed'))
      }

      return data.result
    } catch (error) {
      toast.error(t('check-name.failed'))
    } finally {
      toast.dismiss(loadingId)
    }
  }

  const onRenameWallet = async (walletName: string) => {
    const isExisted = await checkNameIsExisted()
    if (isExisted) return

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
            classes={{ root: '!absolute !w-[35px] !h-[35px] !right-5' }}
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
              autoFocus
              InputProps={{
                classes: { root: 'w-full !rounded-xl !bg-white !break-all' },
              }}
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
            <div className="text-black text-sm w-full">
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

export default WalletRenamePop
