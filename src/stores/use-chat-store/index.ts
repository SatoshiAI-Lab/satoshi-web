import { create } from 'zustand'
import type { States, Actions } from './types'

export const useChatStore = create<States & Actions>((set, get) => ({
  intention: '',
  question: '',
  messages: [],
  // 1. If the question input is in the state of Focus
  // 2. Within 20 seconds after the latest question answer, read the answer
  // 3. Within 10 seconds after the user clicks Ask, wait for the answer
  inputKeyup: false,
  readAnswer: false,
  waitAnswer: false,
  unreadMessages: [],
  chatEl: null,
  isLoading: false,
  // hasSmooth: true,
  // controller: null,
  // isReceiving: false,
  // thinkTimer: undefined,

  setIntention: (intention) => set({ intention }),
  setMessage: (messages) => set({ messages }),
  setUnreadMessage: (unreadMessages) => set({ unreadMessages }),
  // setHasSmooth: (bool) => set({ hasSmooth: bool }),
  setQuestion: (value) => set({ question: value }),
  // setThinkTimer: (value) => set({ thinkTimer: value }),
  // setController: (value) => set({ controller: value }),
  // setIsReceiving: (value) => set({ isLoading: value }),
  setChatEl: (el) => set({ chatEl: el }),
  setIsLoading: (bool) => set({ isLoading: bool }),
  setInputKeyup: (bool) => set({ inputKeyup: bool }),
  setReadAnswer: (bool) => set({ readAnswer: bool }),
  setWaitAnswer: (bool) => set({ waitAnswer: bool }),
  // removeAllMessage: () => set({ messages: [] }),
}))
