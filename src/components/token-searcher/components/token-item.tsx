import React from 'react'
import { Avatar, CircularProgress, IconButton, ListItem } from '@mui/material'
import { clsx } from 'clsx'
import { IoAddOutline, IoCloseOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'

import { type TokenSearchCoin, TokenStatus, TokenType } from '@/api/token/types'

import { CustomSuspense } from '@/components/custom-suspense'
import { Routes } from '@/routes'
import { useTagParser } from '@/views/kline/hooks/use-tag-parser'
import { useFavtokenStore } from '@/stores/use-favorites-store'
import { useFavorites } from '@/components/favorites/hooks/use-favorites'
import { useUserStore } from '@/stores/use-user-store'

interface Props extends React.ComponentProps<'div'> {
  token: TokenSearchCoin
}

export const TokenSearcherItem = (props: Props) => {
  const { token } = props
  const router = useRouter()
  const { t } = useTranslation()
  const { cexParamsToCexTag } = useTagParser()
  const { isLogined } = useUserStore()
  const { tokenList } = useFavtokenStore()
  const { isSelecting, selectToken } = useFavorites({
    enabled: false,
  })

  const isFavorited = (id: number) => tokenList.some((c) => c.id === id)

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

  const onSelectToken = (token: TokenSearchCoin, status: TokenStatus) => {
    if (!isLogined) {
      toast.error(t('no-login'))
      return
    }

    selectToken({
      ids: [
        {
          id: token.id,
          type: TokenType.Token,
        },
      ],
      status,
    })
  }

  return (
    <ListItem
      classes={{
        root: clsx(
          '!w-full !flex !justify-between !items-center cursor-pointer',
          'hover:!bg-gray-100 dark:hover:!bg-zinc-800'
        ),
      }}
      onClick={() => onTokenClick(token)}
    >
      <div className="flex items-center py-1">
        <Avatar src={token.logo} alt="logo" sx={{ width: 30, height: 30 }} />
        <div className="flex flex-col justify-between ml-2">
          <span>{token.symbol}</span>
          <span className="text-sm leading-none text-gray-400">
            {token.name}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <CustomSuspense
          isPendding={isSelecting}
          fallback={
            <IconButton disableRipple disabled>
              <CircularProgress size={20} />
            </IconButton>
          }
        >
          {isFavorited(token.id) ? (
            <IconButton
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onSelectToken(token, TokenStatus.Cancel)
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
                onSelectToken(token, TokenStatus.Add)
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
}

export default TokenSearcherItem
