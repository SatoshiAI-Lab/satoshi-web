import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { MessageBubble } from '../../message-bubble'
import { LoadingMessage } from '../../loading-message'
import { monitorApi } from '@/api/monitor'
import { ResponseCode } from '@/api/fetcher/types'
import { MonitorConfig } from '@/config/monitor'
import { useMonitorStore } from '@/stores/use-monitor-store'

export const SubPoolMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { type, content } = getMetaData<MetaType.SubPool>()
  const { configData, update } = useMonitorStore()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [monitorApi.update.name],
    mutationFn: monitorApi.update,
    onError: (e) => toast.error(e.message),
  })
  const { data: pool, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const addMonitors = () => {
    const monitored = configData?.pool.content.filter((p) => p.subscribed) ?? []
    const newPool = {
      chain: content,
    } as (typeof monitored)[number]
    const unique = [...monitored, newPool].reduce((acc, cur) => {
      acc[cur.chain] = cur
      return acc
    }, {} as Record<string, (typeof monitored)[number]>)

    return Object.values(unique)
  }

  const removeMonitors = () => {
    const monitored =
      configData?.pool.content
        .filter((p) => p.subscribed)
        .filter((p) => p.chain !== content) ?? []

    return monitored
  }

  const onMonitor = () => {
    mutateAsync({
      message_type: MonitorConfig.Pool,
      content: type === 'on' ? addMonitors() : removeMonitors(),
    }).finally(update)
  }

  useEffect(() => {
    if (isEmpty(content)) return

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
  if (isSuccess && pool) {
    return (
      <MessageBubble
        children={
          type === 'on' ? t('monitor.on.success') : t('monitor.off.success')
        }
      />
    )
  }

  // Everyone knows the default is to make the user wait, right?
  return <LoadingMessage children={t('waiting-moment')} />
}

export default SubPoolMessage
