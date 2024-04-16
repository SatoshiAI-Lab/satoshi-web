import { useTranslation } from 'react-i18next'

import { MonitorWalletList } from '@/components/monitor/monitor-wallet-list'
import MessageBubble from '../message-bubble'
import { useMonitorStore } from '@/stores/use-monitor-store'

export const MonitorWalletListBubble = () => {
  const { t } = useTranslation()
  const { configData } = useMonitorStore()

  const addressList = configData?.trade?.content ?? []

  return (
    <MessageBubble>
      {!addressList.length ? (
        <>{t('no.monitor.wallet')}</>
      ) : (
        <MonitorWalletList className="!p-0"></MonitorWalletList>
      )}
    </MessageBubble>
  )
}
