import React, { useEffect, useRef } from 'react'

import type { OrderedListProps } from 'react-markdown/lib/ast-to-react'

interface Props extends OrderedListProps {}

export const Ol = (props: Props) => {
  const { children } = props
  const olRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    // TODO: Perhaps there is a better approach?
    // Change ul previous element to `inline-block`,
    // then there will be no spacing.
    if (!olRef.current) return
    olRef.current?.previousElementSibling?.classList.add('inline-block')
  }, [olRef])

  return (
    <ol className="pl-4 whitespace-normal" ref={olRef}>
      {children}
    </ol>
  )
}

export default Ol
