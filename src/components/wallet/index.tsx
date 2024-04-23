import { FC, createElement, memo, useEffect, useState } from 'react'
import { Button, Dialog, IconButton, Menu, MenuItem } from '@mui/material'
import { AiOutlineSafety, AiOutlineWallet } from 'react-icons/ai'
import { TfiClose } from 'react-icons/tfi'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { WalletCard } from './components/wallet-card'
import { WalletExportKeyPop } from './components/walletpop-exportkey'
import { WalletRenamePop } from './components/walletpop-rename'
import { WalletImportKeyPop } from './components/walletpop-importkey'
import { WalletDeletePop } from './components/walletepop-delete'
import { useWalletStore } from '@/stores/use-wallet-store'
import { ChainPlatformSelect } from '../chain-platform-select'
import { useWallet } from '@/hooks/use-wallet'
import { CustomSuspense } from '../custom-suspense'
import { WalletPlatform } from '@/config/wallet'
import { useClipboard } from '@/hooks/use-clipboard'
import { WalletSkeleton } from './components/skeleton'
import { useChainsPlatforms } from './hooks/use-chains-platforms'
import { WalletSearch } from './components/wallet-search'

import type { WalletDialogProps } from './types'

const dyNamicPop: { [key: number]: FC<WalletDialogProps> } = {
  0: WalletExportKeyPop,
  1: WalletRenamePop,
  2: WalletImportKeyPop,
  3: WalletDeletePop,
}

export const Wallet: FC<WalletDialogProps> = memo((props) => {
  const {
    showButtons = true,
    // Used for show a wallet details.
    onlyWallet,
    onlyWalletRefetch,
    open,
    onClose,
  } = props
  const { wallets, selectedChain, setCurrentWallet } = useWalletStore()
  const { latestWallet, isCreating, isFirstFetchingWallets, createWallet } =
    useWallet({
      enabled: true,
    })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openCreateWallet = Boolean(anchorEl)
  const { copy } = useClipboard()
  // Used for search.
  const [filteredWallets, setFilteredWallets] = useState<typeof wallets>([])
  // Both set current pop & pop title
  const [currentPopTitle, setCurrentPopTitle] = useState<string>()
  const [currentPop, setCurrentPop] = useState<number>(0)
  const [popOpen, setPopOpen] = useState(false)
  const { t } = useTranslation()
  const walletMenu = [
    {
      id: WalletPlatform.SOL,
      title: t('sol-wallet'),
      content: '',
      disable: false,
    },
    {
      id: WalletPlatform.EVM,
      title: t('evm-wallet'),
      content: t('evm-support'),
      disable: false,
    },
    {
      id: WalletPlatform.BEAR,
      title: t('bear-wallet'),
      content: '',
      disable: true,
    },
    // {
    //   id: 'icp',
    //   title: 'ICP Wallet',
    //   content: '',
    //   disable: true,
    // },
  ]

  const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCreatClose = () => {
    setAnchorEl(null)
  }

  const onCreateWallet = async (walletType: WalletPlatform) => {
    const id = toast.loading(t('wallet.creating'))

    setAnchorEl(null)
    try {
      await createWallet(walletType)
      toast.success(t('wallet.createsuccess'))
    } catch (error) {
      toast.error(t('wallet.create-failed'))
    } finally {
      toast.dismiss(id)
    }
  }

  const ImportWalletPrivateKey = () => {
    setCurrentPopTitle(t('wallet.import-wallet.title'))
    setCurrentPop(2)
    setPopOpen(true)
  }

  const exportWalletPrivateKey = (address: string) => {
    setCurrentWallet(address)
    setCurrentPopTitle(t('wallet.title.export-privatekey'))
    setCurrentPop(0)
    setPopOpen(true)
  }

  const renameWallet = (address: string) => {
    setCurrentWallet(address)
    setCurrentPopTitle(t('wallet.title.rename-wallet'))
    setCurrentPop(1)
    setPopOpen(true)
  }

  const copyWalletAddress = (address: string) => {
    copy(address, t('wallet.copy-address.success'))
  }

  const deleteWallet = (address: string) => {
    setCurrentWallet(address)
    setCurrentPopTitle(t('wallet.title.delete-wallet'))
    setCurrentPop(3)
    setPopOpen(true)
  }

  // Sort by date DESC
  const sortWallets = () => {
    wallets.sort((a, b) => {
      const tsA = new Date(a.added_at ?? '').getTime()
      const tsB = new Date(b.added_at ?? '').getTime()

      return tsB - tsA
    })
  }

  // Request chains & platforms when mounted.
  useChainsPlatforms(true)

  // Sort origin wallets.
  useEffect(() => {
    // If only one wallet, no need to sort.
    if (wallets.length <= 1) return

    sortWallets()
  }, [wallets])

  return (
    <>
      <Dialog
        maxWidth="lg"
        PaperProps={{
          className: 'dark:bg-zinc-900 dark:text-gray-300',
          sx: { borderRadius: '10px' },
        }}
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
              <p className="text-[30px]">{t('wallet.quickwallettitle')}</p>
              {showButtons && (
                <div className="flex gap-3 mt-[22px] mb-[13px]">
                  {/* Create Wallet Menu */}
                  <div>
                    <Button
                      onClick={handleCreateClick}
                      disabled={isCreating}
                      startIcon={<AiOutlineWallet />}
                      classes={{
                        root: clsx(
                          '!bg-black !text-white !rounded-full !w-[182px]',
                          'disabled:!bg-zinc-500'
                        ),
                      }}
                    >
                      {t('wallet.createnewwallet')}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={openCreateWallet}
                      onClose={handleCreatClose}
                      classes={{ list: '!p-[0px]' }}
                    >
                      {walletMenu.map((item) => (
                        <MenuItem
                          disabled={item.disable}
                          key={item.id}
                          className={clsx(
                            'w-[295px] h-[65px] flex flex-col !items-start !justify-center',
                            'dark:!text-gray-300'
                          )}
                          onClick={() => onCreateWallet(item.id)}
                        >
                          <div className="text-base">{item.title}</div>
                          <div className="text-sm text-gray-500">
                            {item.content}
                          </div>
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>

                  {/* Import Waller Menu */}
                  <Button
                    classes={{ root: '!text-black !rounded-full !w-[138px]' }}
                    className={clsx(
                      '!border-gray-400 hover:!bg-gray-100',
                      'disabled:!border-gray-300 disabled:!text-gray-400',
                      'dark:hover:!bg-zinc-800 dark:!text-gray-300'
                    )}
                    variant="outlined"
                    disabled={isCreating}
                    onClick={ImportWalletPrivateKey}
                  >
                    {t('wallet.importwallet')}
                  </Button>
                </div>
              )}
              <p className="text-[16px]">{t('wallet.quickwallettip1')}</p>
              <p className="text-[16px]">{t('wallet.quickwallettip2')}</p>
            </div>
            <div>
              <AiOutlineSafety size={162} color="#D4D4D4" />
            </div>
          </div>
          {/* If only one wallet, hide select */}
          {!onlyWallet && (
            <div className="flex justify-between items-center">
              <ChainPlatformSelect />
              <WalletSearch
                wallets={wallets}
                chain={selectedChain}
                onResult={(results) => setFilteredWallets(results)}
              />
            </div>
          )}
          {/* Wallets list */}
          <CustomSuspense
            container="div"
            className="flex flex-col h-[440px] max-h-[440px] overflow-scroll gap-[25px] mt-[20px]"
            isPendding={isFirstFetchingWallets}
            fallback={<WalletSkeleton className="h-[440px] max-h-[440px]" />}
          >
            {filteredWallets.length ? (
              (onlyWallet ? [onlyWallet] : filteredWallets).map((w) => (
                <WalletCard
                  key={w.address}
                  wallet={w}
                  latestWallet={latestWallet}
                  copyAddress={copyWalletAddress}
                  renameWallet={renameWallet}
                  exportKey={exportWalletPrivateKey}
                  deleteWallet={deleteWallet}
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p>{t('wallet.nowallet')}</p>
              </div>
            )}
          </CustomSuspense>
        </div>
      </Dialog>

      {currentPopTitle &&
        createElement(dyNamicPop[currentPop], {
          title: currentPopTitle,
          open: popOpen,
          onClose: () => setPopOpen(false),
          onlyWalletRefetch,
        })}
    </>
  )
})

export default Wallet
