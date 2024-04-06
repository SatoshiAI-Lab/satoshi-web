import React, { useEffect } from 'react'

import type { OrderedListProps } from 'react-markdown/lib/ast-to-react'

interface OlParserProps {
  olProps: OrderedListProps
}

function OlParser(props: OlParserProps) {
  const { olProps } = props

  useEffect(() => {
    // Change ul/ol previous element to inline-block,
    // then there will be no spacing.
    Array.from(document.querySelectorAll('[data-change-parent]')).forEach((e) =>
      e.previousElementSibling?.classList.add('inline-block')
    )
  }, [])

  return (
    <ol className="pl-4 whitespace-normal" data-change-parent>
      {olProps.children}
    </ol>
  )
}

export default OlParser
