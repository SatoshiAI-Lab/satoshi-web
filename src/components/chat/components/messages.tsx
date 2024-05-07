import React, { memo } from 'react'

import type { Message } from '@/stores/use-chat-store/types'

import { IntentMessages } from './intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { LoadingMessage } from './loading-message'
import { TokenMessages } from './token-messages'
import { useChatType } from '@/hooks/use-chat-type'
import { MessagesProvider, useMessagesContext } from '@/contexts/messages'
import { MetaType, MetaTypeData } from '@/api/chat/types'
import { SystemMessages } from './system-messages'
import { NormalChatMessage } from './normal-chat-message'

export const Messages = memo(({ messages }: { messages: Message[] }) => {
  const { processAnswerType, processMetaType, processDataType } = useChatType()

  const getMetaData = <T extends MetaType>(meta: Message['meta']) => {
    return meta?.data as MetaTypeData[T]
  }

  return messages.map((message, i) => (
    <MessagesProvider
      key={i}
      message={message}
      answerType={processAnswerType(message.answer_type)}
      metaType={processMetaType(message.meta?.type)}
      dataType={processDataType(message.data_type)}
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
  const { message, answerType } = useMessagesContext()

  // Loading message.
  if (message.isLoading) return <LoadingMessage />

  // Normal chat message.
  if (answerType.isChatStream) return <NormalChatMessage />

  // System messages category.
  if (message.isSystem) return <SystemMessages />

  // Monitor messages category.
  if (answerType.isWsMonitor) return <MonitorMessages />

  // Intent messages category.
  if (answerType.isIntentStream) return <IntentMessages />

  // Token messages category.
  return <TokenMessages />
}

export default Messages
