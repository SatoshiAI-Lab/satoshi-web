import React, { useEffect, useState } from 'react'
import { Avatar, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useWalletChains } from '../hooks/use-wallet-chains'
import { utilArr } from '@/utils/array'
import { useWalletStore } from '@/stores/use-wallet-store'

export const WalletChainSelect = () => {
  const { t } = useTranslation()
  const [selectedChain, setSelectedChain] = useState('')
  const { chains, platforms } = useWalletChains(true)
  const { getWallets } = useWalletStore()

  const onSelectChain = ({ target }: SelectChangeEvent<string>) => {
    setSelectedChain(target.value)
    getWallets(true, target.value)
  }

  useEffect(() => {
    if (utilArr.isEmpty(chains) && utilArr.isEmpty(platforms)) return

    // By default, use first chain.
    setSelectedChain(utilArr.first(chains).name)
  }, [chains, platforms])

  return (
    <div className="flex items-center">
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
