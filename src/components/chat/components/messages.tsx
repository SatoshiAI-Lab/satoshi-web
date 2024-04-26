import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import { InteractiveMessage } from './interactive-message/interactive-message'
import { IntentMessages } from './intention-message/intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'
import { LoadingMessage } from './loading-message'
import { MessagesProvider, useMessagesContext } from '@/contexts/messages'
import { TokenMessage } from './token-message'

export const Messages = memo(({ messages }: { messages: Message[] }) => {
  return messages.map((message, i) => (
    <MessagesProvider key={i} message={message}>
      <MessagesCategory />
    </MessagesProvider>
  ))
})

// Categorize each message.
const MessagesCategory = () => {
  const { message: m } = useMessagesContext()

  if (m.isLoading) return <LoadingMessage />

  if (m.isMonitor) return <MonitorMessages />

  if (m.isIntention) return <IntentMessages />

  if (m.isInteractive) return <InteractiveMessage />

  if (m.isPrivateKey) return <PrivateKeyMessage />

  return <TokenMessage />
}

export default Messages
