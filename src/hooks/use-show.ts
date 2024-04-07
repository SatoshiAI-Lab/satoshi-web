import { useState } from 'react'

export const useShow = (isShow = false) => {
  const [show, setShow] = useState(isShow)

  const hidden = () => setShow(false)

  const open = () => setShow(true)

  return { show, open, hidden }
}
