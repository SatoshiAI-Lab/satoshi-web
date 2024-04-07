import { create } from 'zustand'

interface States {
  isDark: boolean
}

interface Actions {
  setIsDark: (isDark: boolean) => void
}

/**
 * Global theme store
 */
export const useThemeStore = create<States & Actions>((set) => ({
  isDark: false,
  setIsDark: (isDark) => set({ isDark }),
}))
