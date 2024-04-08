import { throttle } from 'lodash'
import { useCallback, useRef } from 'react'

function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const throttledCallback = useRef(throttle(callback, delay))

  useCallback(() => {
    throttledCallback.current = throttle(callback, delay)
  }, [callback, delay])

  return throttledCallback.current
}

export { useThrottledCallback }
