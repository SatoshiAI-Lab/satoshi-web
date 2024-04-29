import React from 'react'
import { useTranslation } from 'react-i18next'

import { useMessagesContext } from '@/contexts/messages'
import { MessageBubble } from '../message-bubble'
import { MessageMatchError } from '@/components/errors/message-match'

export const SystemMessages = () => {
  const { t } = useTranslation()
  const { metaType, message } = useMessagesContext()

  if (metaType.isClearHistory) {
    return (
      <MessageBubble
        className="text-zinc-500 !py-1"
        role={message.role}
        children={t('clear.history')}
      />
    )
  }

  return (
    <MessageMatchError
      reason={message.meta?.type}
      reasonComponent={SystemMessages}
    />
  )
}

export default SystemMessages
