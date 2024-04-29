import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { LoadingMessage } from '../../loading-message'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { monitorApi } from '@/api/monitor'
import { ResponseCode } from '@/api/fetcher/types'
import { MessageBubble } from '../../message-bubble'
import { MonitorConfig } from '@/config/monitor'
import { ExMonitorBubble } from './ex-monitor-bubble'

export const SubExAnnMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { type, content } = getMetaData<MetaType.SubExAnn>()
  const isZero = content == 0
  const { configData, update } = useMonitorStore()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [monitorApi.update.name],
    mutationFn: monitorApi.update,
  })
  const { data: annData, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const addMonitors = () => {
    const monitored =
      configData?.announcement.content
        .filter((a) => a.subscribed)
        .map((a) => a.id) ?? []
    const unique = new Set([...monitored, content])

    return Array.from(unique)
  }

  const removeMonitors = () => {
    const monitored =
      configData?.announcement.content
        .filter((a) => a.subscribed)
        .map((a) => a.id) ?? []

    return monitored.filter((id) => id !== content)
  }

  const onMonitor = () => {
    mutateAsync({
      message_type: MonitorConfig.Announcement,
      content: type === 'on' ? addMonitors() : removeMonitors(),
    }).finally(update)
  }

  useEffect(() => {
    if (isEmpty(type) || isZero) return

    onMonitor()
  }, [])

  // Monitoring.
  if (isPending) {
    return <LoadingMessage children={t('monitor.setting')} />
  }

  // Monitor error.
  if (isErr) {
    return (
      <MessageBubble
        children={
          type === 'on' ? t('monitor.on.failed') : t('monitor.off.failed')
        }
      />
    )
  }

  // Monitor success.
  if (isSuccess && annData) {
    return (
      <MessageBubble
        children={
          type === 'on' ? t('monitor.on.success') : t('monitor.off.success')
        }
      />
    )
  }

  // If is zero, show all to user.
  if (isZero) {
    return <ExMonitorBubble />
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default SubExAnnMessage
