import { useTranslation } from 'react-i18next'

import { MonitorPools } from '@/components/monitor/monitor-pools'
import { MessageBubble } from '../message-bubble'

export const PoolMonitorBubble = () => {
  const { t } = useTranslation()

  return (
    <MessageBubble>
      <div className="font-bold mb-2">{t('pool.moniotr.handle')}</div>
      <MonitorPools className="!px-0 !pb-3"></MonitorPools>
    </MessageBubble>
  )
}
