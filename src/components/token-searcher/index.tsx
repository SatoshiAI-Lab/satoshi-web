import React, { useEffect, useState } from 'react'
import { CircularProgress, Dialog, DialogContent } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { useDebounce } from 'react-use'
import { toast } from 'react-hot-toast'

import { CustomSuspense } from '../custom-suspense'
import { DialogHeader } from '../dialog-header'
import { useTokenSearcher } from './hooks/use-token-searcher'
import { useUserStore } from '@/stores/use-user-store'
import { TokenSearcherInput } from './components/search-input'
import { TokenSearcherItem } from './components/token-item'

interface TokenSearcherProps extends React.ComponentProps<'div'> {
  open: boolean
  autofocus?: boolean
  onClose?: () => void
}

export const TokenSearcher = (props: TokenSearcherProps) => {
  const { className = '', open, onClose } = props
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { coins, isSearching, search, clearSearch } = useTokenSearcher()
  const { isLogined } = useUserStore()

  const onSearch = () => {
    if (!value.trim()) return
    if (!isLogined) {
      toast.error(t('no-login'))
      return
    }

    search(value)
  }

  const onClear = () => {
    setValue('')
    clearSearch()
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  const debouncer = () => {
    if (!value.trim()) {
      onClear()
      return
    }
    onSearch()
  }

  useDebounce(debouncer, 300, [value])

  useEffect(() => {
    if (open) return
    onClear() // clear search when closed.
  }, [open])

  return (
    <Dialog
      className={className}
      open={open}
      onClose={onClose}
      classes={{
        paper: clsx(
          '!h-[60vh] w-[60vw] !overflow-hidden dark:bg-zinc-900',
          'dark:text-white'
        ),
      }}
    >
      <DialogHeader onClose={onClose} closeBtnClass="!right-3.5">
        <span>{t('search')}</span>
      </DialogHeader>
      <div className="flex items-center border-y border-gray-200 dark:border-zinc-600">
        {/* Search input. */}
        <TokenSearcherInput
          value={value}
          onChange={({ target }) => setValue(target.value)}
          onSearch={onSearch}
          onClear={onClear}
          onKeyUp={onKeyUp}
        />
      </div>
      <DialogContent classes={{ root: '!p-0' }}>
        <CustomSuspense
          container="div"
          className="pt-3 pb-6 overflow-auto"
          isPendding={isSearching}
          fallback={
            <div className="mt-28 mb-10 flex justify-center items-center ">
              <CircularProgress />
            </div>
          }
          nullback={
            <p className="text-center text-gray-400 my-10">{t('no-token')}</p>
          }
        >
          {coins.map((c, i) => (
            <TokenSearcherItem key={i} token={c} />
          ))}
        </CustomSuspense>
      </DialogContent>
    </Dialog>
  )
}

export default TokenSearcher
