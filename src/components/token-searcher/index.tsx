import React, { useEffect, useState } from 'react'
import {
  Avatar,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputBase,
  ListItem,
} from '@mui/material'
import { IoAddOutline, IoCloseOutline, IoSearch } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useDebounce } from 'react-use'
import toast from 'react-hot-toast'

import CustomSuspense from '../custom-suspense'
import { DialogHeader } from '../dialog-header'
import { useTokenSearcher } from './hooks/use-token-searcher'
import { useUserStore } from '@/stores/use-user-store'
import { useFavtokenStore } from '@/stores/use-favorites-store'

import { TokenStatus, type TokenSearchCoin, TokenType } from '@/api/token/types'

interface TokenSearcherProps extends React.ComponentProps<'div'> {
  open: boolean
  autofocus?: boolean
  onClose?: () => void
}

const TokenSearcher = (props: TokenSearcherProps) => {
  const { className = '', open, autofocus = true, onClose } = props
  const { tokenList } = useFavtokenStore()
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const {
    coins,
    isSearching,
    isSelecting,
    isRefetchingToken,
    search,
    clearSearch,
    selectToken,
  } = useTokenSearcher()
  const { isLogined } = useUserStore()
  const [loadingId, setLoadingId] = useState(-1)

  const isFavorited = (id: number) => tokenList.some((c) => c.id === id)

  const isNotLogin = () => {
    if (!isLogined) {
      toast.error(t('no-login'))
    }

    return !isLogined
  }

  const onSearch = () => {
    if (!value.trim()) return
    if (isNotLogin()) return

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

  const onSelectToken = (coin: TokenSearchCoin, status: TokenStatus) => {
    if (isNotLogin()) return

    setLoadingId(coin.id)
    const idToken = {
      id: coin.id,
      type: TokenType.Token,
    }
    selectToken({
      ids: [idToken],
      status,
    })
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
    onClear() // clear search when closed
  }, [open])

  return (
    <Dialog
      className={className}
      open={open}
      onClose={onClose}
      classes={{ paper: '!h-[60vh] w-[60vw] !overflow-hidden' }}
    >
      <DialogHeader onClose={onClose} closeBtnClass="!right-3.5">
        <span>{t('search')}</span>
      </DialogHeader>
      <div className="flex items-center border-y border-gray-200">
        <InputBase
          startAdornment={
            <IconButton onClick={onSearch} classes={{ root: '!ml-2.5' }}>
              <IoSearch className="text-gray-400" size={22} />
            </IconButton>
          }
          endAdornment={
            <IconButton onClick={onClear} classes={{ root: '!mr-4' }}>
              <IoCloseOutline className="text-gray-400" size={22} />
            </IconButton>
          }
          autoFocus={autofocus}
          autoComplete="off"
          classes={{ root: 'w-full !py-1', input: '!pb-0' }}
          placeholder={t('search.input.placeholder')}
          size="small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
          {coins.map((c, i) => {
            return (
              <ListItem
                key={i}
                classes={{
                  root: clsx(
                    '!w-full !flex !justify-between !items-center',
                    'hover:!bg-gray-100 cursor-pointer'
                  ),
                }}
              >
                <div className="flex items-center py-1">
                  <Avatar
                    src={c.logo}
                    alt="Logo"
                    sx={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <span className="ml-2">{c.name}</span>
                </div>
                <div className="flex items-center">
                  <CustomSuspense
                    isPendding={
                      loadingId === c.id && (isSelecting || isRefetchingToken)
                    }
                    fallback={
                      <IconButton disableRipple disabled>
                        <CircularProgress size={20} />
                      </IconButton>
                    }
                  >
                    {isFavorited(c.id) ? (
                      <IconButton
                        className="cursor-pointer"
                        onClick={() => onSelectToken(c, TokenStatus.Cancel)}
                      >
                        <IoCloseOutline size={20} className="text-black" />
                      </IconButton>
                    ) : (
                      <IconButton
                        className="cursor-pointer"
                        onClick={() => onSelectToken(c, TokenStatus.Add)}
                      >
                        <IoAddOutline size={20} color="blue" />
                      </IconButton>
                    )}
                  </CustomSuspense>
                </div>
              </ListItem>
            )
          })}
        </CustomSuspense>
      </DialogContent>
    </Dialog>
  )
}

export default TokenSearcher
