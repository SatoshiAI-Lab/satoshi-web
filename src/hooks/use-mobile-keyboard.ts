import { useEffect, useState } from 'react'

import { useResponsive } from './use-responsive'

/**
 * detect mobile virtual keyboard visiblity.
 * @return Return boolean, true is show, false is hide.
 */
export const useMobileKeyboard = () => {
  let originHeight = 0
  const [isShow, setIsShow] = useState(false)
  const { isMobile } = useResponsive()

  function onResize() {
    const newHeight = window.innerHeight
    setIsShow(newHeight < originHeight)
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile) return

    window.addEventListener('resize', onResize)
    originHeight = window.innerHeight

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [isMobile])

  return isShow
}
