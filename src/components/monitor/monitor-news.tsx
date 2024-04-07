import { Switch } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { MonitorConfigData } from '@/api/monitor/type'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'

interface Props {
  data?: MonitorConfigData
}

export const MonitorNews = ({ data }: Props) => {
  const { t } = useTranslation()

  const { setConfig } = useMonitorStore()

  const checked = data?.news.content.switch == 'on'

  const onSwitch = (_: any, checked: boolean) => {
    data!.news.content.switch = checked ? 'on' : 'off'

    setConfig(
      {
        message_type: MonitorConfig.news,
        content: data!.news.content,
      },
      data!.news
    )
  }

  return (
    <div className="px-10 pb-7 max-sm:px-6">
      <div className="relative left-[-8px] flex items-center">
        <Switch checked={checked} onChange={onSwitch}></Switch>
        <span>
          {t('monitor.news.text1').replace('$1', checked ? t('on') : t('off'))}
        </span>
      </div>
      <div className="mt-3 text-[#02101088]">
        <span>{t('monitor.news.text2')}</span>
      </div>
    </div>
  )
}
