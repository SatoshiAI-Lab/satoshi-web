import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'

import { MetaType } from '@/api/chat/types'
import { useMessagesContext } from '@/contexts/messages'
import { monitorApi } from '@/api/monitor'
import { LoadingMessage } from '../../loading-message'
import { MessageBubble } from '../../message-bubble'
import { TwitterListBubble } from './twitter-list-bubble'
import { useMonitorStore } from '@/stores/use-monitor-store'
import { MonitorConfig } from '@/config/monitor'
import { ResponseCode } from '@/api/fetcher/types'

export const SubTwitterMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { type, content } = getMetaData<MetaType.SubTwitter>()
  const isZero = content == 0 // Use `==` to adaptation string zero.
  const { configData, update } = useMonitorStore()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [monitorApi.update.name],
    mutationFn: monitorApi.update,
  })
  const { data: monitorData, code } = data ?? {}
  const isErr = isError || (code && code !== ResponseCode.Success)

  const addMonitors = () => {
    const monitored = configData?.twitter.content
      .filter((t) => t.subscribed)
      .map((t) => t.twitter_id)
    const unique = new Set([...(monitored ?? []), content as string])

    return Array.from(unique)
  }

  const removeMonitors = () => {
    const monitored = configData?.twitter.content
      .filter((t) => t.subscribed)
      .map((t) => t.twitter_id)
    const unique = new Set(monitored)
    unique.delete(content as string)

    return Array.from(unique ?? [])
  }

  const onMonitor = async () => {
    try {
      await mutateAsync({
        message_type: MonitorConfig.Twitter,
        content: type === 'on' ? addMonitors() : removeMonitors(),
      })
    } catch (error) {
    } finally {
      update()
    }
  }

  useEffect(() => {
    if (!content || isZero) return

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
  if (isSuccess && monitorData) {
    return (
      <MessageBubble
        children={
          type === 'on' ? t('monitor.on.success') : t('monitor.off.success')
        }
      />
    )
  }

  // If is zero, show all.
  if (isZero) {
    return <TwitterListBubble />
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default SubTwitterMessage
