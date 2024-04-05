/**
 * Simple debounce hook.
 * @param callback debounce target function.
 * @param delay delay time.
 * @returns return a debounced function.
 */
export const useDebounce = (callback: Function, delay = 500) => {
  let timer: number

  return () => {
    clearTimeout(timer)
    timer = window.setTimeout(callback, delay)
  }
}
