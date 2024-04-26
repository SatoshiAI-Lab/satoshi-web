import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAddFill } from 'react-icons/ri'
import {
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  Skeleton,
} from '@mui/material'
import { clsx } from 'clsx'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { IoCloseOutline } from 'react-icons/io5'
import { toast } from 'react-hot-toast'

import { PercentTag } from '../percent-tag'
import { TokenSearcher } from '../token-searcher'
import { CustomSuspense } from '../custom-suspense'
import { useFavorites } from './hooks/use-favorites'
import { ListToken, TokenId, TokenStatus, TokenType } from '@/api/token/types'
import { useShow } from '@/hooks/use-show'
import { Routes } from '@/routes'
import { utilFmt } from '@/utils/format'
import { useUserStore } from '@/stores/use-user-store'
import { useTagParser } from '@/views/kline/hooks/use-tag-parser'

export const Favorites = memo((props: React.ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const { tokenList, isFirstLoadingToken, isSelecting, selectToken } =
    useFavorites()
  const router = useRouter()
  const { show, open, hidden } = useShow()
  const { isLogined } = useUserStore()
  const { cexParamsToCexTag } = useTagParser()

  const onTokenClick = (token: ListToken) => {
    // TODO: Adaptation DEX token
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

  const onRemoveToken = (token: ListToken) => {
    const id: TokenId = {
      id: token.id,
      type: TokenType.Token,
    }
    selectToken({
      ids: [id],
      status: TokenStatus.Cancel,
    })
  }

  const onAddFavorite = () => {
    if (!isLogined) {
      toast.error(t('no-login'))
      return
    }
    open()
  }

  return (
    <div
      className={clsx(
        'bg-favorite dark:bg-favorite-dark py-2 text-sm',
        'h-favorite flex flex-col max-lg:hidden',
        className
      )}
    >
      <div
        className={clsx(
          'flex justify-between items-center pl-4 pr-2 pb-2',
          'w-[300px] max-xl:max-w-[280px] border-b',
          'border-gray-300 dark:border-gray-600'
        )}
      >
        <span className="font-semibold text-base mr-1 dark:text-white">
          {t('favorites')}
        </span>
        <div className="flex gap-4 items-center">
          <motion.div whileHover={{ rotate: 180 }}>
            <RiAddFill
              size={22}
              className={clsx(
                'text-lg cursor-pointer text-black dark:text-white',
                'hover:drop-shadow-bold dark:hover:drop-shadow-bold-dark'
              )}
              onClick={onAddFavorite}
            />
          </motion.div>
        </div>
      </div>
      <List className="!bg-transparent !h-full !overflow-auto !py-0 !flex-1">
        <CustomSuspense
          isPendding={isFirstLoadingToken}
          fallback={<FavoritesSkeleton />}
          nullback={
            <p className="text-center text-slate-600 dark:text-gray-300 mt-10">
              {t('no-token')}
            </p>
          }
        >
          {tokenList.map((t, i) => (
            <React.Fragment key={i}>
              {i !== 0 && <Divider />}
              <ListItemButton
                onClick={() => onTokenClick(t)}
                className="dark:!text-white relative group !justify-between"
              >
                <div className="flex justify-between flex-1">
                  <div className="flex items-center gap-2 grow">
                    <Avatar
                      alt="token"
                      src={t.logo}
                      sx={{ width: 24, height: 24 }}
                    />
                    <span className="overflow-hidden mr-2 text-ellipsis">
                      {utilFmt.ellipsis(t.symbol)}
                    </span>
                  </div>
                  <span className="text-end basis-20 mr-1">
                    ${utilFmt.token(t.price)}
                  </span>
                </div>
                <PercentTag
                  percent={t.percent_change_24_h}
                  className="w-16 justify-end mb-1"
                />
                <IconButton
                  size="small"
                  disabled={isSelecting}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemoveToken(t)
                  }}
                  classes={{
                    root: clsx(
                      '!hidden !absolute right-2 top-1/2 -translate-y-1/2',
                      'group-hover:!flex !bg-gray-200 dark:!bg-slate-800 dark:!text-white'
                    ),
                  }}
                >
                  {isSelecting ? (
                    <CircularProgress size={18} />
                  ) : (
                    <IoCloseOutline />
                  )}
                </IconButton>
              </ListItemButton>
            </React.Fragment>
          ))}
        </CustomSuspense>
      </List>
      <TokenSearcher open={show} onClose={hidden} />
    </div>
  )
})

const FavoritesSkeleton: React.FC<React.ComponentProps<'div'>> = (props) => {
  const { className = '' } = props

  return (
    <div className={clsx('flex flex-col gap-3 my-2', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          height={36}
          className="!mx-4 !scale-100 dark:bg-gray-800"
        />
      ))}
    </div>
  )
}

export default Favorites
