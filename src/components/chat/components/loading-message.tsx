import React from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { CircularProgress } from '@mui/material'

import MessageBubble from './message-bubble'

export const LoadingMessage = (props: React.ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()

  return (
    <MessageBubble className={clsx('flex items-center', className)}>
      {t('thinking')}
      <CircularProgress size={18} className="ml-2" />
    </MessageBubble>
  )
}

export default LoadingMessage
