import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { useBackgroundStore } from '@/stores/use-background-store'
import { useRandom } from './use-random'
import { BACKGROUND_CONFIG } from '@/config/background'
import { useThemeStore } from '@/stores/use-theme-store'

/**
 * background iamge hook
 */
export const useBackground = (defaultLoad = false) => {
  const {
    backgroundSrc,
    nextBackgroundSrc,
    blurStyle,
    setBackgroundSrc,
    setNextBackgroundSrc,
    toBlur,
    clearBlur,
  } = useBackgroundStore()
  const random = useRandom(BACKGROUND_CONFIG.urls)
  const { setIsDark } = useThemeStore()

  // next bg image
  const getNextBackground = () => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.src = random()
      img.addEventListener('load', () => {
        setNextBackgroundSrc(img.src)
        resolve('')
      })
      img.addEventListener('error', (e) => {
        toast.error(`[Load Iamge Error]: ${e}`)
        reject(e)
      })
    })
  }

  // change bg iamge, preload next bg image.
  const changeBackground = async () => {
    toBlur()
    setBackgroundSrc(nextBackgroundSrc)
    await getNextBackground()
    setTimeout(clearBlur, 600)
  }

  useEffect(() => {
    if (defaultLoad) {
      toBlur()
      setBackgroundSrc(random())
      getNextBackground().finally(() => setTimeout(clearBlur, 600))
    }
  }, [])

  useEffect(() => {
    const isDark = /black/.test(backgroundSrc)
    setIsDark(isDark)
  }, [backgroundSrc])

  return {
    src: backgroundSrc,
    nextSrc: nextBackgroundSrc,
    blurStyle,
    changeBackground,
  }
}
