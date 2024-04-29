import { useEffect, useRef } from 'react'
import { first, last } from 'lodash'

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
  const initHeight = useRef(0)

  const addHistory = (str: string) => {
    historyRef.current.unshift(str)
    // Each add reset pointer.
    pointerRef.current = 0
  }

  const getPrevHistory = () => {
    if (pointerRef.current + 1 >= historyRef.current.length) {
      return last(historyRef.current)!
    }
    const str = historyRef.current[pointerRef.current]
    pointerRef.current += 1

    return str
  }

  const getNextHistory = () => {
    if (pointerRef.current - 1 < 0) {
      return first(historyRef.current)!
    }
    const ptr = (pointerRef.current -= 1)

    return historyRef.current[ptr]
  }

  const onKeyUp = (event: Event) => {
    const e = event as KeyboardEvent
    const isMultiline = inputRef.current!.offsetHeight > initHeight.current

    if (isMultiline) return
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

    initHeight.current = inputRef.current.offsetHeight
    inputRef.current.addEventListener('keyup', onKeyUp)

    return () => {
      initHeight.current = 0
      inputRef.current?.removeEventListener('keyup', onKeyUp)
    }
  }, [inputRef])

  return {
    addHistory,
  }
}
