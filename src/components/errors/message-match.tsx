import React from 'react'

import type { CustomErrorProps } from './types'

import { MessageBubble } from '../chat/components/message-bubble'

const Bold = (value: string) => {
  return <span className="font-bold">{value}</span>
}

export const MessageMatchError = (props: CustomErrorProps) => {
  const { reason = '', reasonComponent } = props

  return (
    <MessageBubble>
      {Bold('Error')}: component `{reasonComponent?.name}` match failed.
      <p className="text-red-500">
        `{reason}` unable to match to any type of message.
      </p>
    </MessageBubble>
  )
}

export default MessageMatchError
