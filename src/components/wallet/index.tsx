import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { FC, createElement, useState } from 'react'
import { WalletDialogProps } from './types'
import { AiOutlineSafety, AiOutlineWallet } from 'react-icons/ai'
import { WalletCard } from './wallet-card'
import { TfiClose } from 'react-icons/tfi'
import toast from 'react-hot-toast'
import { t } from 'i18next'

import { WalletExportKeyPop } from './walletpop-exportkey'
import { WalletRenamePop } from './walletpop-rename'
import { WalletImportKeyPop } from './walletpop-importkey'
import { WalletDeletePop } from './walletepop-delete'
import { useWalletStore } from '@/stores/use-wallet-store'

const walletMenu = [
  {
    id: 'solana',
    title: 'Solana Wallet',
    content: '',
    disable: false,
  },
  {
    id: 'evm',
    title: 'EVM Wallet',
    content: 'Support ETH/BSC/Blast/ARB',
    disable: true,
  },
]

const dyNamicPop: { [key: number]: FC<WalletDialogProps> } = {
  0: WalletExportKeyPop,
  1: WalletRenamePop,
  2: WalletImportKeyPop,
  3: WalletDeletePop,
}

const Wallet: FC<WalletDialogProps> = ({ finish, open, onClose }) => {
  const { wallets, loading, setCurrentWallet, createWallet, getWallets } =
    useWalletStore()
  // Copy from MUI menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openCreateWallet = Boolean(anchorEl)
  const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCreatClose = () => {
    setAnchorEl(null)
  }

  // Both set current pop & pop title
  const [currentPopTitle, setCurrentPopTitle] = useState<string>()
  const [currentPop, setCurrentPop] = useState<number>(0)
  const [popOpen, setPopOpen] = useState(false)

  const createWalletFunc = (coin_id: string) => {
    setAnchorEl(null)
    createWallet(coin_id).then(async () => {
      const result = await getWallets()
      if (!result) return
      toast.success(t('wallet.createsuccess'))
    })
  }

  const ImportWalletPrivateKey = () => {
    setCurrentPopTitle('Import Private Key')
    setCurrentPop(2)
    setPopOpen(true)
  }

  const exportWalletPrivateKey = (address: string) => {
    setCurrentWallet(address)
    setCurrentPopTitle('Export Private Key')
    setCurrentPop(0)
    setPopOpen(true)
  }

  const renameWallet = (address: string) => {
    setCurrentWallet(address)
    setCurrentPopTitle('Rename Wallet')
    setCurrentPop(1)
    setPopOpen(true)
  }

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success(t('wallet.copy-address.success'))
  }

  const deleteWallet = (address: string) => {
    setCurrentWallet(address)
    setCurrentPopTitle('Delete Wallet')
    setCurrentPop(3)
    setPopOpen(true)
  }
  return (
    <>
      <Dialog
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: '10px' } }}
        open={open}
        onClose={onClose}
      >
        <IconButton
          classes={{
            root: '!absolute !w-[35px] !h-[35px] right-2 top-2',
          }}
          onClick={onClose}
        >
          <TfiClose size={35} />
        </IconButton>
        <div className="my-8 mx-10">
          <div className="flex gap-[102px]">
            <div>
              <p className="text-[30px]">My Quick Wallet</p>
              <div className="flex gap-3 mt-[22px] mb-[13px]">
                {/* Create Wallet Menu */}
                <div>
                  <Button
                    id="basic-button"
                    aria-controls={openCreateWallet ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openCreateWallet ? 'true' : undefined}
                    onClick={handleCreateClick}
                    startIcon={<AiOutlineWallet />}
                    classes={{
                      root: '!bg-black !text-white !rounded-full !w-[182px]',
                    }}
                  >
                    Create Wallet
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openCreateWallet}
                    onClose={handleCreatClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                    classes={{
                      list: '!p-[0px]',
                    }}
                  >
                    {walletMenu.map((item) => (
                      <MenuItem
                        disabled={item.disable}
                        key={item.id}
                        className="w-[295px] h-[65px] flex flex-col !items-start !justify-center"
                        onClick={() => createWalletFunc(item.id)}
                      >
                        <div className="text-[16px]">{item.title}</div>
                        <div className="text-[14px]">{item.content}</div>
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
                {/* Import Waller Menu */}
                <Button
                  classes={{
                    root: '!text-black !rounded-full !w-[138px]',
                  }}
                  className="!border-gray-400 hover:!bg-gray-100"
                  variant="outlined"
                  onClick={ImportWalletPrivateKey}
                >
                  Import Wallet
                </Button>
              </div>
              <p className="text-[16px]">
                Quick wallet simplifies DEX trading for Lightning-fast
                transactions.
              </p>
              <p className="text-[16px]">
                Satoshi AI ensures data security with years of experience and
                robust measures.
              </p>
            </div>
            <div>
              <AiOutlineSafety size={162} color="#D4D4D4" />
            </div>
          </div>
          {/* Wallets list */}
          <div className="flex flex-col h-[440px] max-h-[440px] overflow-scroll gap-[25px] mt-[20px]">
            {(wallets?.length &&
              wallets.map((item) => (
                <WalletCard
                  {...item}
                  platform={item.platform!}
                  token={item.tokens?.length}
                  copyAddress={copyWalletAddress}
                  renameWallet={renameWallet}
                  exportKey={exportWalletPrivateKey}
                  deleteWallet={deleteWallet}
                  key={item.address}
                />
              ))) || (
              <div className="h-full flex items-center justify-center">
                {(loading && <CircularProgress />) || (
                  <p>No Wallets, Please Create Wallet first.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Dialog>

      {currentPopTitle &&
        createElement(dyNamicPop[currentPop], {
          open: popOpen,
          onClose: () => setPopOpen(false),
          title: currentPopTitle,
        })}
    </>
  )
}

export { Wallet }
