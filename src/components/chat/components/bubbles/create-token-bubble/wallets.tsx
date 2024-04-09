import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AiOutlineCopy } from 'react-icons/ai'

import { useWalletStore } from '@/stores/use-wallet-store'
import { Wallet } from '@/components/wallet'
import { utilArr } from '@/utils/array'
import { useClipboard } from '@/hooks/use-clipboard'

const CreateTokenWallets = (props: { hasWallet: boolean }) => {
  const { hasWallet } = props
  const { t } = useTranslation()
  const { currentWallet, wallets, getWallets, setCurrentWallet } =
    useWalletStore()
  const [selectedWallet, setSelectedWallet] = useState<
    typeof currentWallet | undefined
  >(undefined)
  const { copy } = useClipboard()
  const [walletOpen, setWalletOpen] = useState(false)

  const onSelect = ({ target }: SelectChangeEvent<string>) => {
    const targetWallet = wallets.find((w) => w.address === target.value)

    setCurrentWallet(targetWallet?.address ?? '')
  }

  useEffect(() => {
    if (utilArr.isEmpty(wallets)) return

    setCurrentWallet(utilArr.first(wallets).address ?? '')
  }, [wallets])

  useEffect(() => {
    if (currentWallet?.address) {
      setSelectedWallet(currentWallet)
    }
  }, [currentWallet])

  useEffect(() => {
    getWallets()
  }, [])

  return (
    <>
      <Wallet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        showButtons={false}
        onlyWalletAddr={currentWallet?.address}
      />
      {!hasWallet && (
        <div
          className={clsx(
            'mt-4 border border-primary rounded-lg bg-sky',
            'inline-flex items-center p-2'
          )}
        >
          <img src="/images/logos/t.png" alt="Logo" className="w-10 h-10" />
          <div className="flex flex-col text-primary text-sm ml-1">
            <span>{t('create-token.no-wallet').replace('{}', 'Solana')}</span>
            <span>
              {t('create-token.no-wallet-balance').replace('{}', '0.1 SOL')}
            </span>
          </div>
        </div>
      )}
      <div className="mt-4">
        <div className="mb-1">{t('use-below-wallet')}</div>
        <div className="flex items-stretch">
          <Select
            size="small"
            value={selectedWallet?.address ?? ''}
            onChange={onSelect}
          >
            {wallets.map((w) => (
              <MenuItem key={w.id} value={w?.address ?? ''}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
          <div className="flex flex-col justify-between text-sm ml-2">
            <span
              className="text-primary cursor-pointer"
              onClick={() => setWalletOpen(true)}
            >
              {t('view-wallet-details')}
            </span>
            <span className="text-gray-500">
              {t('wallet-balance-confirm').replace('{}', '0.16 SOL')}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div>
          {currentWallet?.name} {t('addr')}:
        </div>
        <div className="flex items-center">
          <span>{currentWallet?.address}</span>
          <AiOutlineCopy
            className="ml-2 cursor-pointer"
            size={18}
            onClick={() => copy(currentWallet?.address ?? '')}
          />
        </div>
      </div>
    </>
  )
}

export default CreateTokenWallets
