import { create } from 'zustand'

interface LoginAuthStore {
  show: boolean
  setShow: (show: boolean) => void
}

export const useLoginAuthStore = create<LoginAuthStore>((set, get) => ({
  show: false,
  setShow: (show: boolean) => set({ show }),
}))
