import React, { useState } from 'react'
import { Switch } from '@mui/material'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

import { TwitterList } from '@/api/monitor/type'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { utilLang } from '@/utils/language'

interface Props extends React.ComponentProps<'div'> {}

export const MonitorTwitterList = ({ className }: Props) => {
  const { t } = useTranslation()
  const { configData: data, setConfig } = useMonitorStore()
  const [loadingId, setLoadingId] = useState<string>()

  const list = data?.twitter.content

  const onSwitch = async (item: TwitterList, checked: boolean) => {
    item.subscribed = checked

    const content = list
      ?.filter((item) => item.subscribed)
      .map((item) => item.twitter_id)

    const data = {
      message_type: MonitorConfig.twitter,
      content,
    }

    try {
      setLoadingId(item.twitter_id)
      await setConfig(data)
    } catch {
    } finally {
      setLoadingId(undefined)
    }
  }

  const handleAll = async (checked: boolean) => {
    const content = checked ? list?.map((item) => item.twitter_id) : []
    const data = {
      message_type: MonitorConfig.twitter,
      content,
    }
    try {
      setLoadingId('item.twitter_id')
      await setConfig(data)
    } catch {
    } finally {
      setLoadingId(undefined)
    }
  }

  return (
    <>
      <div className={clsx('mb-2 flex items-center')}>
        {t('all.on.or.off')}
        <Switch
          checked={!list?.some((item) => !item.subscribed)}
          disabled={!!loadingId}
          onChange={(_, checked) => handleAll(checked)}
        />
      </div>
      <div
        className={clsx(
          'inline-flex flex-col max-sm:mx-auto justify-start max-w-[300px]',
          className
        )}
      >
        {list?.map((item, i) => {
          return (
            <div
              key={i}
              className={clsx(
                'flex justify-between pl-3 pr-2 border border-black',
                'rounded-lg dark:border-zinc-400',
                i !== list.length ? '!mb-3' : ''
              )}
            >
              <div className="flex items-center">
                <img
                  key={item.twitter_id}
                  src={item.logo}
                  alt="Logo"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] object-cover"
                />
                <span className="ml-5">{utilLang.getContent(item.name)}</span>
              </div>
              <Switch
                checked={item.subscribed}
                disabled={!!loadingId}
                onChange={(_, checked) => onSwitch(item, checked)}
              ></Switch>
            </div>
          )
        })}
      </div>
    </>
  )
}
