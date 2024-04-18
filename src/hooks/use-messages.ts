import { nanoid } from 'nanoid'

import { useChatStore } from '@/stores/use-chat-store'
import { utilArr } from '@/utils/array'

import type { Message } from '@/stores/use-chat-store/types'
import type { PartialPick } from '@/types/types'

/**
 * Messages management hook. base API:
 * - `addMessage`: Create & add a message.
 * - `getMessage`: Read & get a message.
 * - `updateMessage`: Update a message.
 * - `removeMessage`: Delete a message.
 **/
export const useMessages = () => {
  const { messages, getMessages, setMessages } = useChatStore()

  // C
  const addMessage = (message: PartialPick<Message, 'id'>) => {
    const newMessage: Message = { id: nanoid(), ...message }
    setMessages((oldMessages) => [...oldMessages, newMessage])
  }

  // R
  const getMessage = (id: string | undefined) => {
    if (!id) return
    return getMessages().find((m) => m.id === id)
  }

  // U
  const updateMessage = (
    id: string | undefined,
    message: PartialPick<Message, 'id' | 'text'>
  ) => {
    if (!id) return
    setMessages((oldMessages) => {
      return oldMessages.map((m) => (m.id === id ? { ...m, ...message } : m))
    })
  }

  // D
  const removeMessage = (id: string | undefined) => {
    if (!id) return
    setMessages((oldMessages) => oldMessages.filter((m) => m.id !== id))
  }

  // Remove latest message.
  const removeLast = () => {
    const last = utilArr.last(getMessages())
    removeMessage(last?.id)
  }

  // Add a loading message.
  const addLoading = () => {
    addMessage({
      role: 'assistant',
      isLoading: true,
      text: 'Loading...',
    })
  }

  // Remove latest loading message.
  const removeLastLoading = () => {
    const loadings = getMessages().filter((m) => m.isLoading)
    const last = utilArr.last(loadings)

    removeMessage(last?.id)
  }

  // Find previous interactive message.
  const findPrevInteractive = (id?: string) => {
    if (!id || !id.trim()) return
    const messages = getMessages()
    let m = messages.findIndex((m) => m.id === id)
    let msg: Message | undefined

    while (msg?.role !== 'user' && m !== -1) {
      m -= 1
      msg = messages[m]
    }

    return msg
  }

  return {
    messages,
    // Base API.
    addMessage,
    getMessage,
    updateMessage,
    removeMessage,
    // Syntactic sugar API.
    getMessages,
    addLoading,
    removeLast,
    removeLastLoading,
    findPrevInteractive,
  }
}
