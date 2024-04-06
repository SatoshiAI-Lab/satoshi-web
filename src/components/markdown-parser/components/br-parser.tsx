import React, { useEffect } from 'react'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface Props {
  brProps: Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>,
    'ref'
  > &
    ReactMarkdownProps
}

function BrParser(props: Props) {
  useEffect(() => {
    // Select contains `data-should-remove` prop element,
    // if don't have next sibling, remove it.
    Array.from(document.querySelectorAll('[data-should-remove]')).forEach(
      (e) => {
        !e.nextSibling && e?.remove()
      }
    )
  }, [])

  // Add special prop to br tag.
  return <br data-should-remove />
}

export default BrParser
