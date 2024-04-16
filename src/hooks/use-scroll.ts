import { useEffect, useState } from 'react'

import { utilDom } from '@/utils/dom'

interface Options {
  el: HTMLElement | null | undefined
  threshold?: number
}

export const useScroll = (options: Options) => {
  const { el, threshold = 100 } = options
  const [isTrigger, setIsTrigger] = useState(false)

  const scrollToBottom = () => {
    if (!el) return
    utilDom.scrollToBottom(el)
  }

  // Waiting for implementation if you need.
  const scrollToTop = () => {}

  const onScroll = () => {
    if (!el) return

    const { scrollHeight, scrollTop, clientHeight } = el
    const scrolled = scrollHeight - scrollTop - clientHeight
    const shouldShow = scrolled > threshold

    setIsTrigger(shouldShow)
  }

  useEffect(() => {
    if (!el) return

    el.addEventListener('scroll', onScroll)

    return () => {
      el.removeEventListener('scroll', onScroll)
    }
  }, [el])

  return { isTrigger, scrollToBottom, scrollToTop }
}
