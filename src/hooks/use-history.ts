import { useEffect, useRef } from 'react'

import { utilArr } from '@/utils/array'

interface Options {
  inputRef: React.MutableRefObject<
    HTMLTextAreaElement | HTMLInputElement | null
  >
  onChange: (str: string) => void
}

export const useHistory = (options: Options) => {
  const { inputRef, onChange } = options
  const historyRef = useRef<string[]>([])
  const pointerRef = useRef(0)

  const addHistory = (str: string) => {
    historyRef.current.unshift(str)
  }

  const getPrevHistory = () => {
    if (pointerRef.current + 1 >= historyRef.current.length) {
      return utilArr.last(historyRef.current)
    }
    const str = historyRef.current[pointerRef.current]
    pointerRef.current += 1

    return str
  }

  const getNextHistory = () => {
    if (pointerRef.current - 1 < 0) {
      return utilArr.first(historyRef.current)
    }
    const ptr = (pointerRef.current -= 1)

    return historyRef.current[ptr]
  }

  const onKeyUp = (event: Event) => {
    const e = event as KeyboardEvent

    if (e.key === 'ArrowUp') {
      onChange(getPrevHistory())
      return
    }
    if (e.key === 'ArrowDown') {
      onChange(getNextHistory())
      return
    }
  }

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.addEventListener('keyup', onKeyUp)

    return () => {
      inputRef.current?.removeEventListener('keyup', onKeyUp)
    }
  }, [inputRef])

  return {
    addHistory,
  }
}
