import { create } from 'zustand'

interface States {
  backgroundSrc: string
  nextBackgroundSrc: string
  blurStyle: BlurStyle
}

interface BlurStyle {
  opacity: string
  filter: string
}

interface Actions {
  setBackgroundSrc: (src: string) => void
  setNextBackgroundSrc: (src: string) => void
  toBlur: () => void
  clearBlur: () => void
}

const defaultBlurStyle = {
  opacity: '1',
  filter: 'blur(0px)',
} as BlurStyle

export const useBackgroundStore = create<States & Actions>((set) => ({
  backgroundSrc: '',
  nextBackgroundSrc: '',
  blurStyle: defaultBlurStyle,
  setBackgroundSrc: (backgroundSrc: string) => set({ backgroundSrc }),
  setNextBackgroundSrc: (src: string) => set({ nextBackgroundSrc: src }),
  toBlur: () => {
    set({ blurStyle: { opacity: '0.5', filter: 'blur(50px)' } })
  },
  clearBlur: () => set({ blurStyle: defaultBlurStyle }),
}))
