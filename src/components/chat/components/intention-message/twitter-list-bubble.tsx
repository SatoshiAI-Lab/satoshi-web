import { useMonitorStore } from '@/stores/use-monitor-store'
import MessageBubble from '../message-bubble'
import { MonitorTwitterList } from '@/components/monitor/monitor-twitter-list'

export const TwitterListBubble = () => {
  const { configData } = useMonitorStore()

  const list = configData?.twitter.content

  if (!list?.length) return <></>

  return (
    <MessageBubble>
      <MonitorTwitterList
        className={'!pt-2 -mb-[3px]'}
        list={list}
      ></MonitorTwitterList>
    </MessageBubble>
  )
}
