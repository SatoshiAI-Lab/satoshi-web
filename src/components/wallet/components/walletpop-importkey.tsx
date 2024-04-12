import { FC, useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from '@mui/material'
import { TfiClose } from 'react-icons/tfi'
import { t } from 'i18next'
import toast from 'react-hot-toast'

import { useWalletStore } from '@/stores/use-wallet-store'
import { useShow } from '@/hooks/use-show'
import { useWallet } from '@/hooks/use-wallet'
import ChainPlatformSelect from '../../chain-platform-select'

import type { WalletDialogProps } from '../types'

const WalletImportKeyPop: FC<WalletDialogProps> = ({
  open,
  onClose,
  title,
}) => {
  const [privateKey, setPrivateKey] = useState('')
  const { selectedPlatform } = useWalletStore()
  const { importPrivateKey } = useWallet()
  const { open: openLoading, hidden: hiddenLoading, show } = useShow()

  const onImportPrivateKey = async () => {
    openLoading()
    try {
      await importPrivateKey(privateKey, selectedPlatform)
      onClose?.()
      toast.success(t('wallet.import-wallet.success'))
    } catch (error) {
      const e = error as { data: { public_key?: string } }

      if (e.data.public_key) {
        toast.error(e.data.public_key)
        return
      }

      toast.error(t('wallet.error'))
    } finally {
      hiddenLoading()
    }
  }

  useEffect(() => {
    setPrivateKey('')
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
        <div className="flex flex-col justify-center items-center m-auto py-7 gap-4 w-[358px]">
          <div>{t('wallet.import-wallet.private-key')}</div>
          <ChainPlatformSelect type="platform" className="!my-0 !self-start" />
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={1}
            maxRows={5}
            placeholder="Private key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <Button
            variant="contained"
            classes={{ root: '!rounded-full !px-8' }}
            disabled={show || privateKey.length == 0}
            onClick={onImportPrivateKey}
            startIcon={show ? <CircularProgress size={16} /> : <></>}
          >
            {t('wallet.import-wallet.confirm')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletImportKeyPop }
