import React, { memo } from 'react'

import type { Message } from '@/stores/use-chat-store/types'
import type { SendChat, StopChat } from '@/hooks/use-chat'

import { IntentMessages } from './intention-message'
import { MonitorMessages } from './monitor-message/monitor-config-bubble'
import { LoadingMessage } from './loading-message'
import { TokenMessages } from './token-messages'
import { useChatType } from '@/hooks/use-chat-type'
import { MessagesProvider, useMessagesContext } from '@/contexts/messages'
import { MetaType, MetaTypeData } from '@/api/chat/types'
import { SystemMessages } from './system-messages'
import { NormalChatMessage } from './normal-chat-message'
import { DefaultMessage } from './default-message'

interface Props {
  messages: Message[]
  sendChat: SendChat
  stopChat: StopChat
}

export const Messages = memo((props: Props) => {
  const { messages, sendChat, stopChat } = props
  const {
    processAnswerType,
    processMetaType,
    processDataType,
    processRoleType,
  } = useChatType()

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
      roleType={processRoleType(message.role)}
      getMetaData={() => getMetaData(message.meta)}
      sendChat={sendChat}
      stopChat={stopChat}
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
  const { message, answerType, roleType } = useMessagesContext()

  // Default message.
  if (message.isDefaultMessage) return <DefaultMessage />

  // Loading message.
  if (message.isLoading) return <LoadingMessage />

  // Normal chat message, user message treat as normal chat.
  if (answerType.isChatStream || roleType.isUser) return <NormalChatMessage />

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
