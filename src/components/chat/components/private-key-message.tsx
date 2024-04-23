import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import MessageBubble from './message-bubble'

interface Props {
  name: string
  privateKey: string
}

export const PrivateKeyMessage = (props: Props) => {
  const { name, privateKey } = props
  const { t } = useTranslation()

  return (
    <MessageBubble>
      <p>{t('export-wallet').replace('{}', name)}:</p>
      <p
        className={clsx(
          'font-bold blur-sm hover:blur-none',
          'transition-all duration-300'
        )}
      >
        {privateKey}
      </p>
    </MessageBubble>
  )
}

export default PrivateKeyMessage
