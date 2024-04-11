import React, { useEffect } from 'react'
import { Avatar, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useWalletChains } from '../hooks/use-wallet-chains'
import { utilArr } from '@/utils/array'
import { useWallet } from '@/hooks/use-wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

export const WalletChainSelect = () => {
  const { t } = useTranslation()
  const { chains, platforms } = useWalletChains(true)
  const { selectedChain, setSelectedChain } = useWalletStore()
  const { refetchWallets } = useWallet()

  const onSelectChain = ({ target }: SelectChangeEvent<string>) => {
    setSelectedChain(target.value)
    refetchWallets()
  }

  useEffect(() => {
    if (utilArr.isEmpty(chains) && utilArr.isEmpty(platforms)) return

    // By default, use first chain.
    setSelectedChain(utilArr.first(chains).name)
  }, [chains, platforms])

  return (
    <div className="flex items-center my-2">
      <div className="mr-2 font-bold">{t('select-chain')}:</div>
      <Select
        classes={{ select: '!flex !items-center' }}
        size="small"
        value={selectedChain}
        onChange={onSelectChain}
      >
        {chains?.map((c, i) => (
          <MenuItem key={i} value={c.name}>
            <Avatar
              src={c.logo}
              sx={{
                width: 24,
                height: 24,
              }}
            >
              {c.name}
            </Avatar>
            <div className="ml-2">{c.name}</div>
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default WalletChainSelect
