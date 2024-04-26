import React, { memo } from 'react'
import { Avatar, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

import { useWalletStore } from '@/stores/use-wallet-store'

interface Props extends React.ComponentProps<'div'> {
  // If `chain`, select chain, else select `platform`
  type?: 'chain' | 'platform'
  avatarSize?: number
}

export const ChainPlatformSelect = memo((props: Props) => {
  const { type = 'chain', className, avatarSize = 24 } = props
  const { t } = useTranslation()
  const {
    chains,
    platforms,
    selectedChain,
    selectedPlatform,
    setSelectedChain,
    setSelectedPlatform,
  } = useWalletStore()

  const ChainSelect = () => {
    return (
      <>
        <div className="mr-2 font-bold">{t('select-chain')}:</div>
        <Select
          classes={{ select: '!flex !items-center' }}
          size="small"
          value={selectedChain}
          onChange={({ target }) => setSelectedChain(target.value)}
        >
          {chains?.map((c, i) => (
            <MenuItem key={i} value={c.name} className="dark:!text-gray-300">
              <Avatar
                src={c.logo}
                sx={{ width: avatarSize, height: avatarSize }}
              >
                {c.name}
              </Avatar>
              <div className="ml-2 dark:text-gray-300 first-letter:uppercase">
                {c.name}
              </div>
            </MenuItem>
          ))}
        </Select>
      </>
    )
  }

  const PlatformSelect = () => {
    return (
      <>
        <div className="mr-2 font-bold">{t('select-platform')}:</div>
        <Select
          classes={{ select: '!flex !items-center' }}
          size="small"
          value={selectedPlatform}
          onChange={({ target }) => setSelectedPlatform(target.value)}
        >
          {platforms?.map((p, i) => (
            <MenuItem key={i} value={p} className="dark:!text-gray-300">
              {p}
            </MenuItem>
          ))}
        </Select>
      </>
    )
  }

  return (
    <div className={clsx('flex items-center my-2', className)}>
      {type === 'chain' && ChainSelect()}
      {type === 'platform' && PlatformSelect()}
    </div>
  )
})

export default ChainPlatformSelect
