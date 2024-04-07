import { create } from 'zustand'

import type { ListToken } from '@/api/token/types'

interface States {
  tokenList: ListToken[]
}

interface Actions {
  setTokenList: (tokenList: ListToken[]) => void
}

export const useFavtokenStore = create<States & Actions>((set) => ({
  tokenList: [],
  setTokenList: (tokenList) => set({ tokenList }),
}))
