import { createContext } from 'react'

import type { Message } from '@/stores/use-chat-store/types'

export const MessagesContext = createContext<{
  message: Message
} | null>(null)
