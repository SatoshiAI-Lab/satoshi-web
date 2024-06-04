import { nanoid } from 'nanoid'
import { useEffect, useRef } from 'react'

export const useOnlyKey = () => {
  const onlyQueryKey = useRef<string>(nanoid())
  return {
    onlyQueryKey,
  }
}
