import { useEffect, MutableRefObject } from 'react'

/**
 * Record an input element context history.
 * @param inputRef To be recorded input element.
 * @param onChange On input change will be trigger.
 */
export const useInputHistory = (
  inputRef: MutableRefObject<HTMLTextAreaElement | null>,
  onChange: (str: string) => void
) => {
  let pointer = 0
  let initialHeight = 0
  const history: string[] = []

  function onKeyDown(e: KeyboardEvent) {
    const t = e.target as HTMLTextAreaElement

    if (e.key === 'Enter' && !e.shiftKey) {
      if (!t.value.trim()) return

      history.unshift(t.value.trim())
      pointer = 0
    }
    if (e.key === 'ArrowUp' && t.offsetHeight <= initialHeight) {
      e.preventDefault()
    }
    if (e.key !== 'ArrowDown') return
    if (pointer <= 0) return
    if (t.offsetHeight > initialHeight) return
    pointer--
    onChange(history[pointer - 1] ?? '')
  }

  function onKeyUp(e: KeyboardEvent) {
    const t = e.target as HTMLTextAreaElement

    if (e.key !== 'ArrowUp') return
    if (pointer >= history.length) return
    if (t.offsetHeight > initialHeight) return

    onChange(history[pointer] ?? '')
    pointer++
  }

  function setInitHeight(el: HTMLTextAreaElement) {
    initialHeight = el.offsetHeight
  }

  useEffect(() => {
    const textArea = inputRef.current

    if (!textArea) return

    setInitHeight(textArea)
    // setInitHeight on window load,
    // otherwise Mui InputBase cannot find correct element.
    window.onload = () => setInitHeight(textArea)
    textArea.addEventListener('keydown', onKeyDown)
    textArea.addEventListener('keyup', onKeyUp)

    return () => {
      textArea.removeEventListener('keydown', onKeyDown)
      textArea.removeEventListener('keyup', onKeyUp)
    }
  }, [inputRef, inputRef.current])
}
