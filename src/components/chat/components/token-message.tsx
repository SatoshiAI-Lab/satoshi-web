import React, { useContext } from 'react'

import { MessageBubble } from './message-bubble'
import { TokenMarkdown } from '@/components/token-markdown'
import { MessagesContext } from '@/contexts/messages'

export const TokenMessage = () => {
  const { message } = useContext(MessagesContext)!

  return (
    <MessageBubble role={message.role}>
      <TokenMarkdown children={message.text} />
    </MessageBubble>
  )
}

export default TokenMessage
