import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import MessageBubble from './bubbles/message-bubble'

interface Props {
  privateKey: string
}

export const PrivateKeyMessage = (props: Props) => {
  const { privateKey } = props
  const { t } = useTranslation()

  return (
    <MessageBubble>
      <p>{t('export-wallet')}:</p>
      <p className={clsx('font-bold blur-sm hover:blur-none')}>{privateKey}</p>
    </MessageBubble>
  )
}

export default PrivateKeyMessage
