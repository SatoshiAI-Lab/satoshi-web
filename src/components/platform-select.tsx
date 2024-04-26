import React from 'react'
import { MenuItem, Select, SelectClasses } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

import { useWalletStore } from '@/stores/use-wallet-store'

interface Props {
  value: string
  onSelect?: (value: string) => void
  classes?: Partial<SelectClasses>
  className?: string
  showTitle?: boolean
  disabled?: boolean
}

export const PlatformSelect = (props: Props) => {
  const {
    value,
    onSelect,
    classes,
    className,
    showTitle = true,
    disabled,
  } = props
  const { t } = useTranslation()
  const { platforms } = useWalletStore()

  return (
    <div className={clsx(showTitle && 'flex items-center', className)}>
      {showTitle && (
        <div className="mr-2 font-bold">{t('select-platform')}:</div>
      )}
      <Select
        classes={{ select: '!flex !items-center', ...classes }}
        size="small"
        value={value}
        onChange={({ target }) => onSelect?.(target.value)}
        disabled={disabled}
      >
        {platforms?.map((p, i) => (
          <MenuItem key={i} value={p} className="not-used-dark:!text-gray-300">
            {p}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default PlatformSelect
