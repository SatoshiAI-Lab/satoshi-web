import { nanoid } from 'nanoid'

import { useChatStore } from '@/stores/use-chat-store'
import { utilArr } from '@/utils/array'
import { CHAT_CONFIG } from '@/config/chat'
import { useHyperTextParser } from './use-hyper-text-parser'

import type { ChatResponse } from '@/api/chat/types'
import type { Message } from '@/stores/use-chat-store/types'

/**
 * Messages management hook, Base API:
 * - `addMessage`: Add a new message.
 * - `removeMessage`: Remove a message by id.
 * - `updateMessage`: Update a message by id.
 * - `getMessage`: Get a message by id.
 * - `addLoadingMessage`: Add a loading message.
 **/
export const useMessages = () => {
  const { messages, setMessages } = useChatStore()

  const addMessage = (message: Message) => {
    const newMessage: Message = {
      id: nanoid(),
      role: 'assistant',
      ...message,
    }

    setMessages((oldMessages) => [...oldMessages, newMessage])
  }

  const removeLast = () => {
    setMessages((messages) => utilArr.removeLast(messages))
  }

  const addLoading = () => {
    const message: Message = {
      id: nanoid(),
      role: 'assistant',
      isLoading: true,
      text: 'Loading...',
    }
    setMessages((messages) => [...messages, message])
  }

  const removeLastLoading = () => {
    setMessages((messages) => {
      const loadingMessages = messages.filter((m) => m.isLoading)
      if (utilArr.isEmpty(loadingMessages)) return messages

      const id = utilArr.last(loadingMessages).id
      return messages.filter((m) => m.id !== id)
    })
  }

  // Find previous interactive message.
  const findPrevInteractive = (id?: string) => {
    if (!id || !id.trim()) return

    let m = messages.findIndex((m) => m.id === id)
    let msg: Message | undefined

    while (msg?.role !== 'user' && m !== -1) {
      m -= 1
      msg = messages[m]
    }

    return msg
  }

  // Using stream's message.
  const addStreamMessage = (data: ChatResponse, m?: Partial<Message>) => {
    const lastMessage = utilArr.last(messages)
    if (!lastMessage) return

    const newMessage: Message = {
      ...data,
      ...lastMessage,
      ...m,
      id: nanoid(),
      role: 'assistant',
      text: lastMessage.text + data.text,
    }

    setMessages((messages) => [...utilArr.modifyLast(messages, newMessage)])
  }

  // Normal message.
  const addNormalMessage = (data: ChatResponse, m?: Partial<Message>) => {
    addMessage({
      ...data,
      ...m,
      id: nanoid(),
      role: 'assistant',
    })
  }

  // Token about message.
  const addTokenMessage = (data: ChatResponse, m?: Partial<Message>) => {
    const [parseHyperText] = useHyperTextParser(CHAT_CONFIG.hyperTextRule)

    addMessage({
      ...data,
      ...m,
      id: nanoid(),
      role: 'assistant',
      text: parseHyperText(data.hyper_text).trim() + '\n\n',
    })
  }

  // Interactive message.
  const addInteractiveMessage = (data: ChatResponse) => {
    addNormalMessage(data, { isInteractive: true })
  }

  // Reference message.
  const addReferenceMesssage = (data: ChatResponse) => {
    const { reference } = CHAT_CONFIG.answerType
    const { type, content, published_at, url } = data.meta
    const parsedContent = content?.replaceAll('\n', '<br />')
    // Must be complete tag
    const refTag = `
      <${reference} 
        type=\"${type}\"
        published_at=\"${published_at}\" 
        url=\"${url}\"
      >${parsedContent}</${reference}>
    `
    const newMessage = {
      ...data,
      text: data.text + refTag,
    }

    addStreamMessage(newMessage, { isReference: true })
  }

  // Monitor message.
  const addMonitorMessages = (messages: Message[]) => {
    messages.forEach((m) => addMessage({ ...m, isMonitor: true }))
  }

  return {
    messages,
    addMessage,
    addLoading,
    removeLast,
    removeLastLoading,
    findPrevInteractive,
    addStreamMessage,
    addNormalMessage,
    addTokenMessage,
    addInteractiveMessage,
    addReferenceMesssage,
    addMonitorMessages,
  }
}
