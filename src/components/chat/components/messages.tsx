import React, { memo } from 'react'

import { type Message } from '@/stores/use-chat-store/types'

import { InteractiveMessage } from './interactive-message'
import { IntentMessages } from './intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { LoadingMessage } from './loading-message'
import { TokenMessage } from './token-message'
import { useChatType } from '@/hooks/use-chat-type'
import { MessagesProvider, useMessagesContext } from '@/contexts/messages'
import { MetaType, MetaTypeData } from '@/api/chat/types'

export const Messages = memo(({ messages }: { messages: Message[] }) => {
  const { identifyAnswerType, identifyMetaType } = useChatType()

  return messages.map((message, i) => (
    <MessagesProvider
      key={i}
      message={message}
      answerType={identifyAnswerType(message.answer_type)}
      metaType={identifyMetaType(message.meta?.type)}
      getMetaData={<T extends MetaType>() => {
        return message.meta?.data as MetaTypeData[T]
      }}
    >
      <MessagesCategory />
    </MessagesProvider>
  ))
})

// Categorize each message.
const MessagesCategory = () => {
  const { message: m } = useMessagesContext()

  // Loading message.
  if (m.isLoading) return <LoadingMessage />

  // Monitor/Subscript related messages.
  if (m.isMonitor) return <MonitorMessages />

  // Intent related messages.
  if (m.isIntent) return <IntentMessages />

  // Interactive related messages.
  if (m.isInteractive) return <InteractiveMessage />

  // By default is token message.
  return <TokenMessage />
}

export default Messages
