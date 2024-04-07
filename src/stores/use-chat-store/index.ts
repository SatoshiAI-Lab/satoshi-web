import { create } from 'zustand'
import type { States, Actions } from './types'

export const useChatStore = create<States & Actions>((set, get) => ({
  intention: '',
  question: '',
  messages: [],
  chatEl: null,
  isLoading: false,
  // hasSmooth: true,
  // controller: null,
  // isReceiving: false,
  // thinkTimer: undefined,

  setIntention: (intention) => set({ intention }),
  setMessage: (messages) => set({ messages }),
  // setHasSmooth: (bool) => set({ hasSmooth: bool }),
  setQuestion: (value) => set({ question: value }),
  // setThinkTimer: (value) => set({ thinkTimer: value }),
  // setController: (value) => set({ controller: value }),
  // setIsReceiving: (value) => set({ isLoading: value }),
  setChatEl: (el) => set({ chatEl: el }),
  setIsLoading: (bool) => set({ isLoading: bool }),
  // removeAllMessage: () => set({ messages: [] }),
}))
