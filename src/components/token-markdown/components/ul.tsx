import React, { useEffect, useRef } from 'react'

import type { UnorderedListProps } from 'react-markdown/lib/ast-to-react'

interface Props extends UnorderedListProps {}

export const Ul = (props: Props) => {
  const { children } = props
  const ulRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // It has the same purpose as ul.
    if (!ulRef.current) return
    ulRef.current.previousElementSibling?.classList.add('inline-block')
  }, [ulRef])

  return (
    <ul className="pl-4 whitespace-normal" ref={ulRef}>
      {children}
    </ul>
  )
}

export default Ul
