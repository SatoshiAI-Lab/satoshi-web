import { useTranslation } from 'react-i18next'
import type { MonitorConfigData } from '@/api/monitor/type'
import { MonitorTwitterList } from './monitor-twitter-list'

interface Props {
  data?: MonitorConfigData
}

export const MonitorTwitter = ({ data }: Props) => {
  const { t } = useTranslation()
  if (!data) return <></>

  return (
    <div className="px-10 max-sm:px-6 max-sm:min-w-[auto]">
      <MonitorTwitterList list={data.twitter.content}></MonitorTwitterList>
      <div className="text-[#02101088] pb-6 text-wrap max-sm:pb-5">
        {t('monitor.twitter.text1')}
      </div>
    </div>
  )
}
