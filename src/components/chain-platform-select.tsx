import React, { memo } from 'react'
import { type SelectClasses } from '@mui/material'
import { clsx } from 'clsx'

import { useWalletStore } from '@/stores/use-wallet-store'
import { ChainSelect } from './chain-select'
import { PlatformSelect } from './platform-select'

interface Props extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  // If `chain`, select chain, else select `platform`
  type?: 'chain' | 'platform'
  avatarSize?: number
  classes?: Partial<SelectClasses>
}

// This component will change the global chain & platform state.
export const ChainPlatformSelect = memo((props: Props) => {
  const { type = 'chain', className, avatarSize = 24, classes } = props
  const {
    selectedChain,
    selectedPlatform,
    setSelectedChain,
    setSelectedPlatform,
  } = useWalletStore()

  return (
    <div className={clsx('flex items-center my-2', className)}>
      {type === 'chain' && (
        <ChainSelect
          value={selectedChain}
          onSelect={setSelectedChain}
          avatarSize={avatarSize}
          classes={classes}
        />
      )}
      {type === 'platform' && (
        <PlatformSelect
          value={selectedPlatform}
          onSelect={setSelectedPlatform}
          classes={classes}
        />
      )}
    </div>
  )
})

export default ChainPlatformSelect
