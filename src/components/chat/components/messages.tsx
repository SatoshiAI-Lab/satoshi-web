import React, { memo } from 'react'

import type { Message } from '@/stores/use-chat-store/types'

import { InteractiveMessage } from './interactive-message'
import { IntentMessages } from './intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { LoadingMessage } from './loading-message'
import { TokenMessage } from './token-message'
import { useChatType } from '@/hooks/use-chat-type'
import { MessagesProvider, useMessagesContext } from '@/contexts/messages'
import { MetaType, MetaTypeData } from '@/api/chat/types'
import { SystemMessages } from './system-messages'

export const Messages = memo(({ messages }: { messages: Message[] }) => {
  const { identifyAnswerType, identifyMetaType, identifyDataType } =
    useChatType()

  const getMetaData = <T extends MetaType>(meta: Message['meta']) => {
    return meta?.data as MetaTypeData[T]
  }

  return messages.map((message, i) => (
    <MessagesProvider
      key={i}
      message={message}
      answerType={identifyAnswerType(message.answer_type)}
      metaType={identifyMetaType(message.meta?.type)}
      dataType={identifyDataType(message.data_type)}
      getMetaData={() => getMetaData(message.meta)}
    >
      <MessagesCategory />
    </MessagesProvider>
  ))
})

// Here is a classification of `answer_type`,
// primarily categorizing the overall types of messages.
// More specific classifications exist within each category.
// For example, monitoring messages are categorized based on `data_type`,
// and intent messages are categorized based on `meta.type`.
const MessagesCategory = () => {
  const { message: m } = useMessagesContext()

  // Loading message.
  if (m.isLoading) return <LoadingMessage />

  // System related messages.
  if (m.isSystem) return <SystemMessages />

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
