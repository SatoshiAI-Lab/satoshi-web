import { create } from 'zustand'

interface ThemeStore {
  isDark: boolean
  setIsDark: (isDark: boolean) => void
  swtichTheme: () => void
}

/**
 * Theme store.
 */
export const useThemeStore = create<ThemeStore>((set, get) => ({
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
  swtichTheme: () => {
    const { isDark, setIsDark } = get()

    setIsDark(!isDark)
  },
}))
