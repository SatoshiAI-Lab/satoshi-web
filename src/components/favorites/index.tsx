import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { RiListSettingsLine, RiAddFill } from 'react-icons/ri'
import { Avatar, Divider, List, ListItemButton, Skeleton } from '@mui/material'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import PercentTag from '../percent-tag'
import TokenSearcher from '../token-searcher'
import CustomSuspense from '../custom-suspense'
import { useFavorites } from './hooks/use-favorites'
import { ListToken } from '@/api/token/types'
import { useShow } from '@/hooks/use-show'
import { Routes } from '@/routes'

export const Favorites = memo((props: React.ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const { tokenList, isFirstLoadingToken } = useFavorites()
  const router = useRouter()
  const { show, open, hidden } = useShow()

  const onAddClick = () => {
    open()
  }

  const onMenuClick = () => {}

  const onTokenClick = (token: ListToken) => {
    router.push({
      pathname: Routes.kline,
      query: {
        symbol: token.symbol,
      },
    })
  }

  return (
    <div
      className={clsx(
        'bg-favorite dark:bg-favorite-dark py-2 text-sm max-lg:hidden',
        className
      )}
    >
      <div className="flex justify-between items-center px-4 w-[300px] max-xl:max-w-[280px]">
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
              onClick={onAddClick}
            />
          </motion.div>
          <motion.div
            whileHover={{ x: [0, -2, 0, 2, 0] }}
            transition={{ duration: 0.3 }}
          >
            <RiListSettingsLine
              className={clsx(
                'text-lg cursor-pointer text-black dark:text-white',
                'hover:drop-shadow-bold dark:hover:drop-shadow-bold-dark'
              )}
              onClick={onMenuClick}
            />
          </motion.div>
        </div>
      </div>
      <List className="!bg-transparent">
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
              <Divider />
              <ListItemButton
                onClick={() => onTokenClick(t)}
                className={'dark:!text-white'}
              >
                <div className="flex items-center gap-2 grow">
                  <Avatar
                    alt="token"
                    src={t.logo}
                    sx={{ width: 24, height: 24 }}
                  />
                  <span className="overflow-hidden mr-2 text-ellipsis ">
                    {t.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-end basis-20 ">
                    {t.price?.toFixed(5)}
                  </span>
                  <PercentTag percent={t.percent_change_24_h} />
                </div>
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
        <Skeleton key={i} height={36} className="!mx-4 !scale-100" />
      ))}
    </div>
  )
}

export default Favorites
