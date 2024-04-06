import { create } from 'zustand'

interface NeedLoginStoreType {
  show: boolean
  setShow: (show: boolean) => void
}

export const useNeedLoginStore = create<NeedLoginStoreType>((set, get) => ({
  show: false,
  setShow: (show: boolean) => set({ show }),
}))
