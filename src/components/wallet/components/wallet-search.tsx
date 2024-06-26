import React, { useEffect, useState } from 'react'
import { IconButton, TextField } from '@mui/material'
import { IoCloseOutline, IoSearch } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'react-use'

import { PartialWalletRes } from '@/stores/use-wallet-store'

interface Props {
  wallets: PartialWalletRes[]
  chain: string
  autofocus?: boolean
  searchBy?: (keyof Omit<PartialWalletRes, 'chain' | 'tokens'>)[]
  onResult: (wallets: PartialWalletRes[]) => void
}

export const WalletSearch = (props: Props) => {
  const {
    wallets,
    chain,
    autofocus = false,
    searchBy = ['name', 'address'],
    onResult,
  } = props
  const { t } = useTranslation()
  const [kw, setKw] = useState('') // keyword

  const onSearch = () => {
    if (!kw.trim()) return

    // Match search keyword.
    const filtered = searchBy.map((s) =>
      wallets.filter((w) => w[s]?.toLowerCase().includes(kw.toLowerCase()))
    )
    // Remove duplicate.
    const unique = filtered.flat().reduce((acc, cur) => {
      acc[cur.id ?? ''] = cur
      return acc
    }, {} as Record<string, PartialWalletRes>)
    const result = Object.values(unique)

    onResult(result)
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
    <TextField
      InputProps={{
        classes: {
          root: '!px-0 not-used-dark:!text-gray-300',
        },
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
  )
}

export default WalletSearch
