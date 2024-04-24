import React from 'react'
import { IconButton, InputBase } from '@mui/material'
import { IoCloseOutline, IoSearch } from 'react-icons/io5'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

interface Props extends React.ComponentProps<'input'> {
  onSearch: (kw: string | number | readonly string[] | undefined) => void
  onClear: () => void
}

export const TokenSearcherInput = (props: Props) => {
  const {
    autoFocus = true,
    value,
    onChange,
    onKeyUp,
    onKeyDown,
    onSearch,
    onClear,
  } = props
  const { t } = useTranslation()

  return (
    <InputBase
      startAdornment={
        <IconButton
          onClick={() => onSearch(value)}
          classes={{ root: '!ml-2.5' }}
        >
          <IoSearch className="text-gray-400" size={22} />
        </IconButton>
      }
      endAdornment={
        <IconButton onClick={onClear} classes={{ root: '!mr-4' }}>
          <IoCloseOutline className="text-gray-400" size={22} />
        </IconButton>
      }
      autoFocus={autoFocus}
      autoComplete="off"
      classes={{
        root: 'w-full !py-1',
        input: clsx(
          '!pb-0 dark:placeholder:text-white dark:caret-white',
          'dark:text-white'
        ),
      }}
      placeholder={t('search.input.placeholder')}
      size="small"
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
    />
  )
}

export default TokenSearcherInput
