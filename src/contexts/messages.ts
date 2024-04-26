import { ReactNode, createContext, createElement, useContext } from 'react'

import type { Message } from '@/stores/use-chat-store/types'

import { useChatType } from '@/hooks/use-chat-type'
import { MetaType, MetaTypeData } from '@/api/chat/types'

type AnswerTypeFn = ReturnType<typeof useChatType>['identifyAnswerType']

type MetaTypeFn = ReturnType<typeof useChatType>['identifyMetaType']

interface ContextValue {
  message: Message
  answerType: ReturnType<AnswerTypeFn>
  metaType: ReturnType<MetaTypeFn>

  // Why we need `getMetaData` function?
  // Because you don't know `message.meta.data` specific type.
  // By passing a generic through this method, we can obtain the specific type.
  getMetaData: <T extends MetaType>() => MetaTypeData[T]
}

interface ProviderProps extends ContextValue {
  children: ReactNode
}

// 1. Create a context for internal use(don't export).
const MessagesContext = createContext<ContextValue | null>(null)

// 2. Create a provider component for external use.
export const MessagesProvider = (props: ProviderProps) => {
  const { children, ...value } = props

  return createElement(MessagesContext.Provider, { value }, children)
}

// 3. Create a specialized hook for external use.
export const useMessagesContext = () => {
  const context = useContext(MessagesContext)

  if (!context) {
    throw new Error('`MessagesContext` Not Found.')
  }

  return context
}
