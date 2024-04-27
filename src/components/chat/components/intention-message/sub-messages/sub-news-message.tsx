import React, { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { MetaType } from '@/api/chat/types'
import { useMessagesContext } from '@/contexts/messages'
import { monitorApi } from '@/api/monitor'
import { MessageBubble } from '../../message-bubble'
import { MonitorConfig } from '@/config/monitor'
import { LoadingMessage } from '../../loading-message'
import { useMonitorStore } from '@/stores/use-monitor-store'

export const SubNewsMessage = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const { type } = getMetaData<MetaType.SubNews>()
  const { update } = useMonitorStore()

  const { data, isPending, isError, isSuccess, mutateAsync } = useMutation({
    mutationKey: [monitorApi.update.name],
    mutationFn: monitorApi.update,
  })
  const { data: subData, status = -1 } = data ?? {}

  useEffect(() => {
    if (isEmpty(type)) return

    mutateAsync({
      message_type: MonitorConfig.News,
      content: { switch: type },
    }).then(update)
  }, [])

  // Subscription pending.
  if (isPending) {
    return <LoadingMessage children={t('monitor.setting')} />
  }

  // Subscription error.
  if (isError && status !== 200) {
    return (
      <MessageBubble>
        {type === 'on' ? t('monitor.on.failed') : t('monitor.off.failed')}
      </MessageBubble>
    )
  }

  // Subscription success.
  if (isSuccess && subData) {
    return (
      <MessageBubble>
        {type === 'on' ? t('monitor.on.success') : t('monitor.off.success')}
      </MessageBubble>
    )
  }

  return <LoadingMessage children={t('waiting-moment')} />
}

export default SubNewsMessage
