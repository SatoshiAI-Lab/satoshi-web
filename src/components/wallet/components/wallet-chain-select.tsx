import React, { useEffect } from 'react'
import { Avatar, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { useWalletChains } from '../hooks/use-wallet-chains'
import { utilArr } from '@/utils/array'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Props extends React.ComponentProps<'div'> {
  avatarSize?: number
}

export const WalletChainSelect = (props: Props) => {
  const { className, avatarSize = 24 } = props
  const { t } = useTranslation()
  const { chains, platforms } = useWalletChains(true)
  const { selectedChain, setSelectedChain } = useWalletStore()

  const onSelectChain = ({ target }: SelectChangeEvent<string>) => {
    setSelectedChain(target.value)
  }

  useEffect(() => {
    if (utilArr.isEmpty(chains) && utilArr.isEmpty(platforms)) return

    // By default, use first chain.
    setSelectedChain(utilArr.first(chains).name)
  }, [chains, platforms])

  return (
    <div className={clsx('flex items-center my-2', className)}>
      <div className="mr-2 font-bold">{t('select-chain')}:</div>
      <Select
        classes={{ select: '!flex !items-center' }}
        size="small"
        value={selectedChain}
        onChange={onSelectChain}
      >
        {chains?.map((c, i) => (
          <MenuItem key={i} value={c.name}>
            <Avatar src={c.logo} sx={{ width: avatarSize, height: avatarSize }}>
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
