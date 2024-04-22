import React from 'react'
import { Button } from '@mui/material'
import { MdAccountBalanceWallet, MdWaterDrop } from 'react-icons/md'
import { FaTwitter } from 'react-icons/fa'
import { IoNewspaper } from 'react-icons/io5'
import { AiFillBank } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { MonitorMenuType } from './monitor-entry-point'

interface Props {
  onOpenItem: (comp: MonitorMenuType) => void
}

export const MonitorMenu = (props: Props) => {
  const { t } = useTranslation()
  const { onOpenItem } = props

  const monitorMenu = [
    {
      id: MonitorMenuType.wallet,
      name: t('monitor.wallet.title'),
      icon: MdAccountBalanceWallet,
    },
    {
      id: MonitorMenuType.twitter,
      name: t('monitor.twitter.title'),
      icon: FaTwitter,
    },
    {
      id: MonitorMenuType.pools,
      name: t('monitor.pools.title'),
      icon: MdWaterDrop,
    },
    {
      id: MonitorMenuType.news,
      name: t('monitor.news.title'),
      icon: IoNewspaper,
    },
    {
      id: MonitorMenuType.exInfo,
      name: t('monitor.exinfo.title'),
      icon: AiFillBank,
    },
  ]

  return (
    <div
      className={clsx(
        'relative mt-3 flex justify-between min-h-[320px]',
        'max-sm:justify-center max-sm:mt-0'
      )}
    >
      <img
        src="/images/monitor/monitor.png"
        alt="Logo"
        className="absolute bottom-0 right-0 w-56 max-sm:hidden"
      />
      <div
        className={clsx(
          'flex flex-col mb-5 ml-10 mr-64 items-start',
          'max-sm:mx-0 max-sm:items-stretch'
        )}
      >
        {monitorMenu.map((item, i) => {
          return (
            <Button
              key={item.name}
              variant="outlined"
              color="inherit"
              size="large"
              className={clsx(
                '!justify-start !py-[6px] !bg-white max-sm:!py-2',
                'dark:!bg-zinc-800 dark:!text-gray-300 dark:border-gray-600',
                i !== monitorMenu.length - 1 ? '!mb-4' : '!mb-2'
              )}
              onClick={() => onOpenItem(item.id)}
            >
              <item.icon size={18}></item.icon>
              <span className="ml-2">{item.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
