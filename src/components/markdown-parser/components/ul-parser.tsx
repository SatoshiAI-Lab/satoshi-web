import React, { useEffect } from 'react'

import type { UnorderedListProps } from 'react-markdown/lib/ast-to-react'

interface UlParserProps {
  ulProps: UnorderedListProps
}

export const UlParser: React.FC<UlParserProps> = (props) => {
  const { ulProps } = props

  useEffect(() => {
    // Change ul/ol previous element to inline-block,
    // then there will be no spacing.
    Array.from(document.querySelectorAll('[data-change-parent]')).forEach((e) =>
      e.previousElementSibling?.classList.add('inline-block')
    )
  }, [])

  return (
    <ul className="pl-4 whitespace-normal" data-change-parent>
      {ulProps.children}
    </ul>
  )
}

export default UlParser
