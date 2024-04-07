import { useWalletStore } from '@/stores/use-wallet-store'
import { Button, Dialog, IconButton, TextField } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { WalletDialogProps } from './types'
import { TfiClose } from 'react-icons/tfi'
import toast from 'react-hot-toast'
import { t } from 'i18next'

const WalletImportKeyPop: FC<WalletDialogProps> = ({
  open,
  onClose,
  title,
}) => {
  const [privateKey, setPrivateKey] = useState('')
  const { importWallet: importPrivateKey, getWallets } = useWalletStore()
  const importWallet = (privateKey: string) => {
    importPrivateKey(privateKey)
      .then(() => {
        toast.success(t('wallet.import-wallet.success'))
        onClose?.()
        getWallets()
      })
      .catch(() => {
        toast.error(t('wallet.error'))
      })
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
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Private key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <Button variant="contained" onClick={() => importWallet(privateKey)}>
            {t('wallet.import-wallet.confirm')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletImportKeyPop }
