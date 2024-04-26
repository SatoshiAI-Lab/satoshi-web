import React from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { CircularProgress } from '@mui/material'

import MessageBubble from './message-bubble'

interface Props extends React.ComponentProps<'div'> {
  withProgress?: boolean
  disableAnime?: boolean
}

export const LoadingMessage = (props: Props) => {
  const { className, children, withProgress = true, disableAnime } = props
  const { t } = useTranslation()

  return (
    <MessageBubble
      className={clsx('flex items-center', className)}
      disableAnime={disableAnime}
    >
      {children || t('thinking')}
      {withProgress && <CircularProgress size={18} className="ml-2" />}
    </MessageBubble>
  )
}

export default LoadingMessage
