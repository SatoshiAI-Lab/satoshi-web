import React from 'react'

import { CHAT_CONFIG } from '@/config/chat'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface DivParserProps {
  divProps: Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    'ref'
  > &
    ReactMarkdownProps
}

function DivParser(props: DivParserProps) {
  const {
    divProps: { node, children },
  } = props
  const { tokenProp } = CHAT_CONFIG.refRule

  // Token div
  if (node?.properties?.hasOwnProperty(tokenProp)) {
    // remove useChatStore handleNormalMessage temp add newline
    const result = children.map((c) =>
      typeof c === 'string' ? c.replaceAll(/\n\s+/g, '') : c
    )
    return <div>{result}</div>
  }

  return <div>{children}</div>
}

export default DivParser
