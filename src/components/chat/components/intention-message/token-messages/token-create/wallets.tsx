import React, { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AiOutlineCopy } from 'react-icons/ai'
import { first } from 'lodash'
import { useQuery } from '@tanstack/react-query'

import type { UserCreateWalletResp } from '@/api/wallet/params'

import { Wallet } from '@/components/wallet'
import { useClipboard } from '@/hooks/use-clipboard'
import { walletApi } from '@/api/wallet'
import { useTokenCreateConfig } from '@/hooks/use-token-create-config'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Props extends React.ComponentProps<'div'> {
  onSelectWallet?: (wallet: UserCreateWalletResp | undefined) => void
}

export const CreateTokenWallets = (props: Props) => {
  const { onSelectWallet } = props
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { chain_name } = getMetaData<MetaType.TokenCreate>()
  const [wallets, setWallets] = useState<UserCreateWalletResp[]>([])
  const [selectedWallet, setSelectedWallet] = useState<UserCreateWalletResp>()
  const { copy } = useClipboard()
  const [walletOpen, setWalletOpen] = useState(false)
  const { config } = useTokenCreateConfig(chain_name)
  const { hasWallet } = useWalletStore()

  const nativeTokenTip = config?.nativeToken ?? ''
  const minBalanceTip = `${config?.minBalance ?? 0} ${nativeTokenTip}`

  const { data: walletData, refetch } = useQuery({
    queryKey: [walletApi.getWallets.name, chain_name],
    queryFn: () => walletApi.getWallets(chain_name),
  })

  const onSelect = (event: SelectChangeEvent<string>) => {
    const wallet = wallets.find((w) => w.address === event.target.value)
    setSelectedWallet(wallet)
    onSelectWallet?.(wallet)
  }

  const defualtSelect = (list: UserCreateWalletResp[]) => {
    const selected = list.find((w) => w.address === selectedWallet?.address)

    // If not select, select first.
    if (!selected) {
      const firstWallet = first(list)
      setSelectedWallet(firstWallet)
      onSelectWallet?.(firstWallet)
      return
    }
    setSelectedWallet(selected)
  }

  useEffect(() => {
    const walletList = walletData?.data[chain_name] ?? []

    setWallets(walletList)
    defualtSelect(walletList)
  }, [walletData?.data])

  return (
    <>
      <Wallet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        showButtons={false}
        onlyWallet={selectedWallet}
        onlyWalletRefetch={refetch}
      />
      {!hasWallet(chain_name) && (
        <div
          className={clsx(
            'mt-4 border border-primary rounded-lg bg-sky',
            'inline-flex items-center p-2'
          )}
        >
          <img src="/images/logos/t.png" alt="Logo" className="w-10 h-10" />
          <div className="flex flex-col text-primary text-sm ml-1">
            <span>
              {t('create-token.no-wallet').replace('{}', nativeTokenTip)}
            </span>
            <span>
              {t('create-token.no-wallet-balance').replace('{}', minBalanceTip)}
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
              <MenuItem
                key={w.id}
                value={w?.address ?? ''}
                className="not-used-dark:!text-gray-300"
              >
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
              {t('wallet-balance-confirm').replace('{}', minBalanceTip)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div>
          {selectedWallet?.name} {t('addr')}:
        </div>
        <div className="flex items-center">
          <span>{selectedWallet?.address}</span>
          <AiOutlineCopy
            className="ml-2 cursor-pointer"
            size={18}
            onClick={() => copy(selectedWallet?.address ?? '')}
          />
        </div>
      </div>
    </>
  )
}

export default CreateTokenWallets
