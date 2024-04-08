import { FC, useEffect, useState } from 'react'
import { Button, CircularProgress, Dialog, IconButton } from '@mui/material'
import { TfiClose } from 'react-icons/tfi'
import { t } from 'i18next'
import toast from 'react-hot-toast'

import { useWalletStore } from '@/stores/use-wallet-store'
import { WalletDialogProps } from './types'

const WalletExportKeyPop: FC<WalletDialogProps> = ({
  open,
  onClose,
  title,
}) => {
  const { currentWallet, exportWalletPrivateKey } = useWalletStore()
  const [privateKey, setPrivateKey] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    exportWalletPrivateKey(currentWallet.id!)
      .then((res) => {
        if (res) {
          setPrivateKey(res.private_key)
          setLoading(false)
        }
      })
      .catch((err) => {})
  }, [currentWallet.address])
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
          <div className="text-[#0F40F5] text-[18px] font-bold">
            {currentWallet.name}
          </div>
          <div>{t('wallet.export-privatekey')}</div>
          <div className="w-[358px] break-words px-[22px] py-[16px] bg-[#0f40f519] rounded-[10px] text-blue-700">
            {(loading && <CircularProgress />) || privateKey}
          </div>
          <Button
            variant="contained"
            disabled={loading}
            onClick={() => {
              navigator.clipboard.writeText(privateKey)
              toast.success(t('wallet.copy-privatekey.success'))
            }}
          >
            {t('wallet.copy-privatekey')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletExportKeyPop }
