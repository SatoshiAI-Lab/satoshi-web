import React from 'react'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { clsx } from 'clsx'

import { MessageBubble } from '../components/message-bubble'
import { useMessagesContext } from '@/contexts/messages'

export interface DefaultMessageOption {
  id: string
  title: string
  details: string
}

interface Props extends React.ComponentProps<'div'> {}

export const DefaultMessage = (props: Props) => {
  const { className } = props
  const { t } = useTranslation()
  const { sendChat } = useMessagesContext()
  const defaultChatOptions = [
    {
      id: nanoid(),
      title: t('wallet.create'),
      details: t('wallet.create.details'),
    },
    {
      id: nanoid(),
      title: t('wallet.view'),
      details: t('wallets.view.details'),
    },
    {
      id: nanoid(),
      title: t('token.create'),
      details: t('token.create.details'),
    },
  ]

  return (
    <MessageBubble className={clsx('mt-2', className)}>
      <div className="mb-1">{t('message-default')}</div>
      <div className="flex items-center text-gray-500">
        {t('help-me')}:{' '}
        {defaultChatOptions.map((o) => (
          <div
            key={o.id}
            className={clsx(
              'ml-2 cursor-pointer hover:text-black transition-all duration-300',
              'not-used-dark:hover:text-gray-300'
            )}
            onClick={() => sendChat({ question: o.details })}
          >
            {o.title}
          </div>
        ))}
      </div>
    </MessageBubble>
  )
}

export default DefaultMessage
