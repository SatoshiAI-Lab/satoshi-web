import React, { useEffect, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { IoCloseOutline, IoSearch } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'react-use'

import { WalletCardProps } from '@/stores/use-wallet-store'

interface Props {
  wallets: WalletCardProps[]
  chain: string
  autofocus?: boolean
  searchBy?: keyof Omit<WalletCardProps, 'chain' | 'tokens'>
  onResult: (wallets: WalletCardProps[]) => void
}

export const WalletSearch = (props: Props) => {
  const {
    wallets,
    chain,
    autofocus = false,
    searchBy = 'name',
    onResult,
  } = props
  const { t } = useTranslation()
  const [kw, setKw] = useState('') // keyword

  const onSearch = () => {
    if (!kw.trim()) return

    const filtered = wallets.filter((w) =>
      w[searchBy]?.toLowerCase().includes(kw.toLowerCase())
    )
    onResult(filtered)
  }

  const onClear = () => {
    setKw('')
    onResult(wallets)
  }

  const debouncer = () => {
    if (!kw.trim()) onClear()
    onSearch()
  }

  useDebounce(debouncer, 300, [kw])

  // Auto set init list & search when wallets/chain change,
  // otherwise the list will not be update when change chain/rename.
  useEffect(() => {
    onResult(wallets)
    onSearch()
  }, [wallets, chain])

  return (
    <div>
      <TextField
        InputProps={{
          classes: { root: '!px-0' },
          startAdornment: (
            <IconButton onClick={onSearch}>
              <IoSearch className="text-gray-400" size={22} />
            </IconButton>
          ),
          endAdornment: (
            <IconButton onClick={onClear}>
              <IoCloseOutline className="text-gray-400" size={22} />
            </IconButton>
          ),
        }}
        placeholder={t('search-wallet')}
        autoComplete="off"
        size="small"
        autoFocus={autofocus}
        value={kw}
        onChange={({ target }) => setKw(target.value)}
        onKeyUp={(e) => e.key === 'Enter' && onSearch()}
      />
    </div>
  )
}

export default WalletSearch
