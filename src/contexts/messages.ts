import { ReactNode, createContext, createElement, useContext } from 'react'

import type { Message } from '@/stores/use-chat-store/types'

interface ContextValue {
  message: Message
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
