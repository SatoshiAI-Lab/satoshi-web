import React, { useEffect, useRef } from 'react'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface Props extends ReactMarkdownProps {}

export const Br = (props: Props) => {
  const brRef = useRef<HTMLBRElement>(null)

  useEffect(() => {
    if (!brRef.current) return

    // If don't have next sibling, remove it.
    if (brRef.current?.nextSibling) return
    brRef.current?.nextSibling?.remove()
  }, [brRef])

  return <br ref={brRef} />
}

export default Br
