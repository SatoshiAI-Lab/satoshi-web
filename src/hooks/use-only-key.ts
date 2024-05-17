import { nanoid } from 'nanoid'
import { useEffect, useRef } from 'react'

export const useOnlyKey = () => {
  const onlyQueryKey = useRef<string>()

  useEffect(() => {
    onlyQueryKey.current = nanoid()
  }, [])

  return {
    onlyQueryKey,
  }
}
