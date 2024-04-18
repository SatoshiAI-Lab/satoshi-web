import { create } from 'zustand'

import type { States, Actions } from './types'

export const useChatStore = create<States & Actions>((set, get) => ({
  intention: '',
  question: '',
  messages: [],
  chatEl: null,
  isLoading: false,

  // 1. If the question input is in the state of Focus
  // 2. Within 20 seconds after the latest question answer, read the answer
  // 3. Within 10 seconds after the user clicks Ask, wait for the answer
  inputKeyup: false,
  readAnswer: false,
  waitAnswer: false,
  unreadMessages: [],
  socket: undefined,

  setIntention: (intention) => set({ intention }),
  setQuestion: (question) => set({ question }),
  getMessages: () => get().messages,
  setMessages: (newMessages) => {
    // If need current message, use function, such as `setState`.
    if (typeof newMessages === 'function') {
      return set(({ messages }) => ({
        messages: newMessages(messages),
      }))
    }

    set({ messages: newMessages })
  },
  setChatEl: (chatEl) => set({ chatEl }),
  setIsLoading: (isLoading) => set({ isLoading }),

  setInputKeyup: (inputKeyup) => set({ inputKeyup }),
  setReadAnswer: (readAnswer) => set({ readAnswer }),
  setWaitAnswer: (waitAnswer) => set({ waitAnswer }),
  setUnreadMessage: (unreadMessages) => set({ unreadMessages }),
  setSocket: (socket) => set({ socket: socket }),
}))
