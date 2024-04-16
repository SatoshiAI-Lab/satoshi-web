import React, { useEffect } from 'react'

import type { UnorderedListProps } from 'react-markdown/lib/ast-to-react'

interface Props extends UnorderedListProps {}

export const Ul = (props: Props) => {
  const { children } = props

  useEffect(() => {
    // Change ul/ol previous element to inline-block,
    // then there will be no spacing.
    Array.from(document.querySelectorAll('[data-change-parent]')).forEach((e) =>
      e.previousElementSibling?.classList.add('inline-block')
    )
  }, [])

  return (
    <ul className="pl-4 whitespace-normal" data-change-parent>
      {children}
    </ul>
  )
}

export default Ul
