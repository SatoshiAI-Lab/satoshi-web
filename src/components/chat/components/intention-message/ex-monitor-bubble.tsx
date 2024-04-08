import { ChatResponseAnswerMeta } from '@/api/chat/types'
import MessageBubble from '../message-bubble'
import { MonitorLabelSwitch } from '@/components/monitor/monitor-label-switch'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorEXInfo } from '@/components/monitor/monitor-ex-info'
import { useTranslation } from 'react-i18next'

export const ExMonitorBubble = () => {
  const { t } = useTranslation()
  return (
    <MessageBubble>
      <div className='font-bold mb-2'>{t('ex.monitor.handle')}</div>
      <MonitorEXInfo className="!px-0 !pb-2"></MonitorEXInfo>
    </MessageBubble>
  )
}
