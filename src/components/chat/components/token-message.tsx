import React from 'react'

import { MessageBubble } from './message-bubble'
import { TokenMarkdown } from '@/components/token-markdown'
import { useMessagesContext } from '@/contexts/messages'

export const TokenMessage = () => {
  const { message } = useMessagesContext()

  return (
    <MessageBubble role={message.role}>
      <TokenMarkdown children={message.text} />
    </MessageBubble>
  )
}

export default TokenMessage
