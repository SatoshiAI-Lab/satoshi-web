import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiListSettingsLine, RiAddFill } from 'react-icons/ri'
import {
  Avatar,
  Dialog,
  Divider,
  List,
  ListItemButton,
  OutlinedInput,
  Skeleton,
} from '@mui/material'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { IoSearch, IoCloseOutline, IoAddOutline } from 'react-icons/io5'

import PercentTag from './percent-tag'
import { useFavorites } from '@/hooks/use-favorites'
import { ListToken } from '@/api/token/types'
import { useShow } from '@/hooks/use-show'
import { DialogHeader } from './dialog-header'

import { Routes } from '@/routes'

export const Favorites: React.FC<React.ComponentProps<'div'>> = (props) => {
  const { className } = props
  const { t } = useTranslation()
  const { tokenList, isFirstLoadingToken } = useFavorites()
  const router = useRouter()

  const { show, open, hidden } = useShow()

  const coins = [
    {
      logo: './images/i1.png',
      name: 'XAUUSD',
      isAdd: false,
    },
    {
      logo: './images/i1.png',
      name: 'XAUUSD11',
      isAdd: true,
    },
  ]

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
          <RiAddFill
            size={22}
            className={clsx(
              'text-lg cursor-pointer text-black dark:text-white',
              'hover:drop-shadow-bold dark:hover:drop-shadow-bold-dark'
            )}
            onClick={onAddClick}
          />
          <RiListSettingsLine
            className={clsx(
              'text-lg cursor-pointer text-black dark:text-white',
              'hover:drop-shadow-bold dark:hover:drop-shadow-bold-dark'
            )}
            onClick={onMenuClick}
          />
        </div>
      </div>
      {isFirstLoadingToken && <FavoritesSkeleton />}
      <List className="!bg-transparent">
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
      </List>
      <Dialog open={show}>
        <DialogHeader
          text={<span>{t('search')}</span>}
          onClose={hidden}
          showCloseBtn
        ></DialogHeader>
        <div className="min-w-[450px]">
          <div className="flex items-center border-y border-gray-200 px-5 py-2">
            <IoSearch className="text-gray-400" size={22} />
            <input
              placeholder={t('search.input.placeholder')}
              className="outline-none pt-[2px] pl-2"
            ></input>
          </div>
          <div className="pt-3 pb-6">
            {coins.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`flex justify-between py-3  px-5 ${
                    i != coins.length ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={item.logo}
                      alt="Logo"
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] rounded-full object-cover"
                    />
                    <span className="ml-2">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    {item.isAdd ? (
                      <IoCloseOutline
                        size={20}
                        color="#00000088"
                        className="cursor-pointer"
                      ></IoCloseOutline>
                    ) : (
                      <IoAddOutline
                        size={20}
                        color="blue"
                        className="cursor-pointer"
                      ></IoAddOutline>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

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
