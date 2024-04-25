import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import { InteractiveMessage } from './interactive-message/interactive-message'
import { IntentionMessage } from './intention-message/intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'
import { LoadingMessage } from './loading-message'
// import { CustomMessages } from './custom-messages'
import { MessagesContext } from '@/contexts/messages'
import { TokenMessage } from './token-message'

export const Messages = memo(({ messages }: { messages: Message[] }) => {
  return messages.map((message, i) => (
    <MessagesContext.Provider key={i} value={{ message }}>
      <MessagesCategory m={message} />
    </MessagesContext.Provider>
  ))
})

// Categorize each message.
const MessagesCategory = ({ m }: { m: Message }) => {
  if (m.isLoading) return <LoadingMessage />

  if (m.isMonitor) return <MonitorMessages />

  if (m.isIntention) return <IntentionMessage />

  if (m.isInteractive) return <InteractiveMessage />

  if (m.isPrivateKey) return <PrivateKeyMessage />

  // if (m.isCustom) return <CustomMessages />

  return <TokenMessage />
}

export default Messages
