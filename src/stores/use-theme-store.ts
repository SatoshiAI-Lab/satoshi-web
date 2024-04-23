import { create } from 'zustand'

interface States {
  isDark: boolean
}

interface Actions {
  setIsDark: (isDark: boolean) => void
}

/**
 * Theme store.
 */
export const useThemeStore = create<States & Actions>((set) => ({
  isDark: false,
  setIsDark: (isDark) => {
    set({ isDark })

    if (typeof window === 'undefined') return
    if (isDark) {
      window.document.documentElement.classList.add('dark')
    } else {
      window.document.documentElement.classList.remove('dark')
    }
  },
}))
