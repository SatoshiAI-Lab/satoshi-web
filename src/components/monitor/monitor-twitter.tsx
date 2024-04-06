import { Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'

import type { MonitorConfigData, TwitterList } from '@/api/monitor/type'

interface Props {
  data?: MonitorConfigData
}

export const MonitorTwitter = ({ data }: Props) => {
  const { t } = useTranslation()
  const { setConfig } = useMonitorStore()
  if (!data) return <></>

  const { content: xList } = data.twitter

  const onSwitch = (item: TwitterList, checked: boolean) => {
    item.subscribed = checked

    const content = xList
      .filter((item) => item.subscribed)
      .map((item) => item.twitter_id)

    const data = {
      message_type: MonitorConfig.twitter,
      content,
    }

    setConfig(data, xList)
  }

  return (
    <div className="px-10 max-sm:px-6 max-sm:min-w-[auto]">
      <div className="inline-flex flex-col max-sm:mx-auto justify-start">
        {xList?.map((item, i) => {
          return (
            <div
              className={`flex justify-between pl-3 pr-2 border border-black rounded-lg ${
                i !== xList.length ? '!mb-4' : ''
              }`}
            >
              <div className="flex items-center">
                <img
                  key={item.name}
                  src={item.logo}
                  alt="Logo"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] object-cover"
                />
                <span className="ml-5">{item.name}</span>
              </div>
              <Switch
                checked={item.subscribed}
                onChange={(_, checked) => onSwitch(item, checked)}
              ></Switch>
            </div>
          )
        })}
      </div>
      <div className="mt-3 text-[#02101088] pb-6 text-wrap max-sm:pb-5">
        {t('monitor.twitter.text1')}
      </div>
    </div>
  )
}
