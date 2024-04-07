import { useMonitorStore } from '@/stores/use-monitor-store'
import MessageBubble from '../message-bubble'
import { MonitorTwitterList } from '@/components/monitor/monitor-twitter-list'
import { useTranslation } from 'react-i18next'

export const TwitterListBubble = () => {
  const { t } = useTranslation()

  const { configData } = useMonitorStore()

  const list = configData?.twitter.content

  if (!list?.length) return <></>

  return (
    <MessageBubble>
      <div className="flex flex-col">
        <span className="mb-1 font-bold">
          {t('monitor.twitter.list.tips1')}
        </span>
        <MonitorTwitterList
          className={'!pt-2 -mb-[3px]'}
          list={list}
        ></MonitorTwitterList>
      </div>
    </MessageBubble>
  )
}