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
import { clsx } from 'clsx'
import { useDebounce } from 'react-use'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

import { CustomSuspense } from '../custom-suspense'
import { DialogHeader } from '../dialog-header'
import { useTokenSearcher } from './hooks/use-token-searcher'
import { useUserStore } from '@/stores/use-user-store'
import { useFavtokenStore } from '@/stores/use-favorites-store'
import { TokenStatus, type TokenSearchCoin, TokenType } from '@/api/token/types'
import { useTagParser } from '@/views/kline/hooks/use-tag-parser'
import { Routes } from '@/routes'

interface TokenSearcherProps extends React.ComponentProps<'div'> {
  open: boolean
  autofocus?: boolean
  onClose?: () => void
}

export const TokenSearcher = (props: TokenSearcherProps) => {
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
  const { cexParamsToCexTag } = useTagParser()
  const router = useRouter()

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

  const onTokenClick = (token: TokenSearchCoin) => {
    const tag = cexParamsToCexTag({
      exchange: '*',
      symbol: `${token.symbol}-USDT`,
      interval: '15m',
    })

    router.push({
      pathname: Routes.candle,
      query: { tag },
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
                    '!w-full !flex !justify-between !items-center cursor-pointer',
                    'hover:!bg-gray-100 dark:hover:!bg-zinc-800'
                  ),
                }}
                onClick={() => onTokenClick(c)}
              >
                <div className="flex items-center py-1">
                  <Avatar
                    src={c.logo}
                    alt="logo"
                    sx={{ width: 30, height: 30 }}
                  />
                  <div className="flex flex-col justify-between ml-2">
                    <span>{c.symbol}</span>
                    <span className="text-sm leading-none text-gray-400">
                      {c.name}
                    </span>
                  </div>
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
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectToken(c, TokenStatus.Cancel)
                        }}
                      >
                        <IoCloseOutline
                          size={20}
                          className="text-black dark:text-white"
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectToken(c, TokenStatus.Add)
                        }}
                      >
                        <IoAddOutline
                          size={20}
                          className="text-primary dark:text-secondary"
                        />
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
