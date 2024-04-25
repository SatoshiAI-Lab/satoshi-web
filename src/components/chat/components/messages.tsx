import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import { MessageBubble } from './message-bubble'
import { InteractiveMessage } from './interactive-message/interactive-message'
import { TokenMarkdown } from '@/components/token-markdown'
import { IntentionMessage } from './intention-message/intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { PrivateKeyMessage } from './private-key-message'
import { LoadingMessage } from './loading-message'
// import { CustomMessages } from './custom-messages'
import { MessagesContext } from '@/contexts/messages'

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

  return (
    <MessageBubble role={m.role}>
      <TokenMarkdown children={m.text} />
    </MessageBubble>
  )
}

export default Messages
