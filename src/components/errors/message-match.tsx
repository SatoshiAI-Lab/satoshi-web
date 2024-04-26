import React from 'react'

import type { CustomErrorProps } from './types'

import { MessageBubble } from '../chat/components/message-bubble'

export const MessageMatchError = (props: CustomErrorProps) => {
  const {
    reason = 'Unable to match to any type of message.',
    reasonComponent,
  } = props

  return (
    <MessageBubble>
      Component `{reasonComponent?.name}` occurred error:
      <p className="text-red-500">{reason}</p>
    </MessageBubble>
  )
}

export default MessageMatchError
