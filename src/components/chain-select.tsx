import React from 'react'
import { Avatar, MenuItem, Select, type SelectClasses } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

import { useWalletStore } from '@/stores/use-wallet-store'

interface Props {
  value: string
  onSelect?: (value: string) => void
  className?: string
  classes?: Partial<SelectClasses>
  avatarSize?: number
  showTitle?: boolean
  disabled?: boolean
}

export const ChainSelect = (props: Props) => {
  const {
    value,
    onSelect,
    classes,
    className,
    avatarSize = 24,
    showTitle = true,
    disabled,
  } = props
  const { t } = useTranslation()
  const { chains } = useWalletStore()

  return (
    <div className={clsx(showTitle && 'flex items-center', className)}>
      {showTitle && <div className="mr-2 font-bold">{t('select-chain')}:</div>}
      <Select
        classes={{
          select: '!flex !items-center',
          notchedOutline: '!border-red-500',
          ...classes,
        }}
        size="small"
        value={value}
        onChange={({ target }) => onSelect?.(target.value)}
        disabled={disabled}
      >
        {chains?.map((c, i) => (
          <MenuItem
            key={i}
            value={c.name}
            className="not-used-dark:!text-gray-300"
          >
            <Avatar src={c.logo} sx={{ width: avatarSize, height: avatarSize }}>
              {c.name}
            </Avatar>
            <div className="ml-2 not-used-dark:text-gray-300 first-letter:uppercase">
              {c.name}
            </div>
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default ChainSelect
