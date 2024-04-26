import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import { MessageBubble } from './message-bubble'
import { useMessagesContext } from '@/contexts/messages'

export const PrivateKeyMessage = () => {
  const { message } = useMessagesContext()
  const { t } = useTranslation()
  // TODO: Waiting for implementation.

  console.log('private key message', message)

  return (
    <MessageBubble>
      <p>{t('export-wallet').replace('{}', 'name')}:</p>
      <p
        className={clsx(
          'font-bold blur-sm hover:blur-none',
          'transition-all duration-300'
        )}
      >
        Waiting for implementation
      </p>
    </MessageBubble>
  )
}

export default PrivateKeyMessage
