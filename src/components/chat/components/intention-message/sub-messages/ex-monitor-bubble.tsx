import { useTranslation } from 'react-i18next'

import { MonitorEXInfo } from '@/components/monitor/monitor-ex-info'
import MessageBubble from '../../message-bubble'

export const ExMonitorBubble = () => {
  const { t } = useTranslation()
  return (
    <MessageBubble>
      <div className="font-bold mb-2">{t('ex.monitor.handle')}</div>
      <MonitorEXInfo className="!px-0 !pb-2"></MonitorEXInfo>
    </MessageBubble>
  )
}
