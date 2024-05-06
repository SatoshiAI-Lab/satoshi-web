import { create } from 'zustand'
import { nanoid } from 'nanoid'

import type { ChatStore, Message } from './types'

import { utilDom } from '@/utils/dom'

export const useChatStore = create<ChatStore>((set, get) => ({
  question: '',
  messages: [],
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
  updateMessage: (id, message) => {
    const newMessages = get().messages.map((m) =>
      m.id === id ? { ...m, ...message } : m
    )

    set({ messages: newMessages })
    return newMessages
  },
  getMessage: (id) => get().messages.find((m) => m.id === id),

  setChatEl: (chatEl) => set({ chatEl }),
  setChatInputEl: (chatInputEl) => set({ chatInputEl }),
  setIsLoading: (isLoading) => set({ isLoading }),

  setInputKeyup: (inputKeyup) => set({ inputKeyup }),
  setReadAnswer: (readAnswer) => set({ readAnswer }),
  setWaitAnswer: (waitAnswer) => set({ waitAnswer }),
  setUnreadMessage: (unreadMessages) => set({ unreadMessages }),
  setSocket: (socket) => set({ socket: socket }),

  chatScrollToBottom: () => {
    const { chatEl } = get()
    if (chatEl) utilDom.scrollToBottom(chatEl)
  },
}))
