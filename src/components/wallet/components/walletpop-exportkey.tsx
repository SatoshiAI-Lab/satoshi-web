import { FC, useEffect } from 'react'
import { Button, CircularProgress, Dialog, IconButton } from '@mui/material'
import { TfiClose } from 'react-icons/tfi'
import { t } from 'i18next'

import { useWalletStore } from '@/stores/use-wallet-store'
import { useWallet } from '@/hooks/use-wallet'
import { useClipboard } from '@/hooks/use-clipboard'

import type { WalletDialogProps } from '../types'

const WalletExportKeyPop: FC<WalletDialogProps> = (props) => {
  const { open, onClose, title } = props
  const { currentWallet } = useWalletStore()
  const { privateKey, isExporting, exportPrivateKey, resetExportPrivateKey } =
    useWallet()
  const { isCopied, copy } = useClipboard()

  useEffect(() => {
    if (!currentWallet) return
    if (!open) resetExportPrivateKey()

    exportPrivateKey(currentWallet?.id ?? '')
  }, [currentWallet, open])

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
            {currentWallet?.name}
          </div>
          <div>{t('wallet.export-privatekey')}</div>
          <div className="w-[358px] break-words px-[22px] py-[16px] bg-[#0f40f519] rounded-[10px] text-blue-700">
            {isExporting ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              privateKey
            )}
          </div>
          <Button
            variant="contained"
            classes={{ root: '!px-6' }}
            disabled={isExporting || isCopied}
            onClick={() => copy(privateKey)}
          >
            {isCopied ? t('copied') : t('wallet.copy-privatekey')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export { WalletExportKeyPop }
