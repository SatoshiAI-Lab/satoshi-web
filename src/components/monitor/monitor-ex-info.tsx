import { MonitorLabelSwitch } from './monitor-label-switch'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'

import type { AnnouncementList } from '@/api/monitor/type'
import clsx from 'clsx'
import { useState } from 'react'
import { Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  className?: string
}

export const MonitorEXInfo = ({ className }: Props) => {
  const { t } = useTranslation()

  const { configData, setConfig } = useMonitorStore()
  const [loadingId, setLoadingId] = useState<string>()

  const exList = configData?.announcement.content

  const onSwitch = async (item: AnnouncementList, checked: boolean) => {
    item.subscribed = checked

    const content = exList!
      .filter((item) => item.subscribed)
      .map((item) => item.id)

    const data = {
      message_type: MonitorConfig.announcement,
      content: content,
    }
    try {
      setLoadingId(`${item.id}`)
      await setConfig(data)
    } catch {
    } finally {
      setLoadingId('')
    }
  }

  const handleAll = async (checked: boolean) => {
    const list = checked ? exList?.map((item) => item.id) : []
    exList?.map((item) => {
      return {
        ...item,
        subscribed: checked,
      }
    })
    try {
      setLoadingId('all')
      await setConfig({
        message_type: MonitorConfig.announcement,
        content: list,
      })
    } catch {
    } finally {
      setLoadingId('')
    }
  }

  return (
    <div className={clsx('px-10 pb-7', className)}>
      <div className="mb-2 flex items-center">
        {t('all.on.or.off')}
        <Switch
          checked={!exList?.some((item) => !item.subscribed)}
          disabled={!!loadingId}
          onChange={(_, checked) => handleAll(checked)}
        ></Switch>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 max-sm:grid-cols-1">
        {exList?.map((item, i) => {
          return (
            <MonitorLabelSwitch
              key={i}
              data={item}
              disabled={!!loadingId}
              logo={`https://img.mysatoshi.ai/exchange/logo/${item.name}.png`}
              onSwitch={(checked) => onSwitch(item, checked)}
            ></MonitorLabelSwitch>
          )
        })}
      </div>
    </div>
  )
}
