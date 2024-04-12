import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AiOutlineCopy } from 'react-icons/ai'

import { Wallet } from '@/components/wallet'
import { utilArr } from '@/utils/array'
import { useClipboard } from '@/hooks/use-clipboard'
import { useQuery } from '@tanstack/react-query'
import { walletApi } from '@/api/wallet'
import { UserCreateWalletResp } from '@/api/wallet/params'
import { useCreateTokenConfig } from '@/hooks/use-create-token-config'

interface Props extends React.ComponentProps<'div'> {
  hasWallet: boolean
  chain?: string
  onSelectWallet?: (wallet: UserCreateWalletResp | undefined) => void
}

const CreateTokenWallets = (props: Props) => {
  const { hasWallet, chain, onSelectWallet } = props
  const { t } = useTranslation()
  const [wallets, setWallets] = useState<UserCreateWalletResp[]>([])
  const [selectedWallet, setSelectedWallet] = useState<UserCreateWalletResp>()
  const { copy } = useClipboard()
  const [walletOpen, setWalletOpen] = useState(false)
  const { config } = useCreateTokenConfig(chain)
  const nativeTokenTip = config?.nativeToken ?? ''
  const minBalanceTip = `${config?.minBalance ?? 0} ${nativeTokenTip}`

  // Use independent request.
  const { data: walletData } = useQuery({
    staleTime: Infinity, // Each bubble only request once.
    queryKey: [walletApi.getWallets.name, chain],
    queryFn: () => walletApi.getWallets(chain),
  })

  const onSelect = (event: SelectChangeEvent<string>) => {
    const wallet = wallets.find((w) => w.address === event.target.value)
    setSelectedWallet(wallet)
    onSelectWallet?.(wallet)
  }

  useEffect(() => {
    const walletList = walletData?.data ?? []

    setWallets(walletList)
    // If not select, select first.
    if (!selectedWallet) {
      const first = utilArr.first(walletList)
      setSelectedWallet(first)
      onSelectWallet?.(first)
    }
  }, [walletData?.data])

  return (
    <>
      <Wallet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        showButtons={false}
        onlyWallet={selectedWallet}
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
