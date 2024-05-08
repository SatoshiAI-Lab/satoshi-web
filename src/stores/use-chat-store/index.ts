import { create } from 'zustand'
import { nanoid } from 'nanoid'

import type { ChatStore, Message } from './types'

import { utilDom } from '@/utils/dom'

const defaultMessage: Message = {
  id: nanoid(),
  role: 'assistant',
  text: '',
  isDefaultMessage: true,
}

export const useChatStore = create<ChatStore>((set, get) => ({
  question: '',
  messages: [defaultMessage],
  chatEl: null,
  chatInputEl: null,
  isLoading: false,

  // 1. If the question input is in the state of Focus
  // 2. Within 20 seconds after the latest question answer, read the answer
  // 3. Within 10 seconds after the user clicks Ask, wait for the answer
  inputKeyup: false,
  readAnswer: false,
  waitAnswer: false,
  unreadMessages: [],
  socket: undefined,

  setQuestion: (question) => set({ question }),
  getMessages: () => get().messages,
  setMessages: (newMessages) => {
    // If need current message, use function, such as `setState`.
    if (typeof newMessages === 'function') {
      return set(({ messages }) => ({ messages: newMessages(messages) }))
    }
    set({ messages: newMessages })
  },
  addMessage: (message) => {
    const { messages, chatEl } = get()
    const newMessage: Message = { id: nanoid(), ...message }

    set({ messages: [...messages, newMessage] })
    chatEl && utilDom.scrollToBottom(chatEl)
    return newMessage
  },
  removeMessage: (id) => {
    const newMessages = get().messages.filter((m) => m.id !== id)

    set({ messages: newMessages })
    return newMessages
  },
  updateMessage: (id, updater) => {
    const newMessages = get().messages.map((m) =>
      m.id === id ? updater(m) : m
    )

    set({ messages: newMessages })
    return newMessages
  },
  getMessage: (id) => {
    const messages = get().messages
    const idx = messages.findIndex((m) => m.id === id)

    return [messages[idx], idx]
  },

  findPrevMessage: (id) => {
    const messages = get().messages
    const idx = messages.findIndex((m) => m.id === id)
    const prevMessage = messages[idx - 1]

    return prevMessage
  },

  setChatEl: (chatEl) => set({ chatEl }),
  setChatInputEl: (chatInputEl) => set({ chatInputEl }),
  setIsLoading: (isLoading) => set({ isLoading }),

  setInputKeyup: (inputKeyup) => set({ inputKeyup }),
  setReadAnswer: (readAnswer) => set({ readAnswer }),
  setWaitAnswer: (waitAnswer) => set({ waitAnswer }),
  setUnreadMessage: (unreadMessages) => set({ unreadMessages }),
  setSocket: (socket) => set({ socket: socket }),

  scrollToChatBottom: () => {
    const { chatEl } = get()
    if (chatEl) utilDom.scrollToBottom(chatEl)
  },
}))
