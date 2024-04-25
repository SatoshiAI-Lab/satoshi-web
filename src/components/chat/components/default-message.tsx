import React from 'react'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'
import { clsx } from 'clsx'

import MessageBubble from '../components/message-bubble'

export interface DefaultMessageOption {
  id: string
  title: string
  details: string
}

interface Props extends React.ComponentProps<'div'> {
  onOptionClick: (option: DefaultMessageOption) => void
}

export const DefaultMessage = (props: Props) => {
  const { className, onOptionClick } = props
  const { t } = useTranslation()
  const defaultChatOptions = [
    {
      id: nanoid(),
      title: t('create-wallet'),
      details: t('create-wallet-details'),
    },
    {
      id: nanoid(),
      title: t('view-wallets'),
      details: t('view-wallets-details'),
    },
    {
      id: nanoid(),
      title: t('create-token'),
      details: t('create-token-details'),
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
            onClick={() => onOptionClick(o)}
          >
            {o.title}
          </div>
        ))}
      </div>
    </MessageBubble>
  )
}

export default DefaultMessage
