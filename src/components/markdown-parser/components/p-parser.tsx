import React from 'react'

import LiParser from './li-parser'
import { CHAT_CONFIG } from '@/config/chat'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'
import type { Element as HElement } from 'hast'

export interface PPraserProps {
  pProps: Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >,
    'ref'
  > &
    ReactMarkdownProps
}

function PParser(props: PPraserProps) {
  const {
    pProps,
    pProps: { children, node },
  } = props
  const { refNumber } = CHAT_CONFIG.refRule

  if (children === undefined) return <></>

  const link = node.children.find(
    (e) => (e as HElement).tagName === 'a'
  ) as HElement

  const matchRef = children?.join('').match(refNumber)

  // Token tag
  if (link && link?.properties?.hasOwnProperty('mid')) {
    return <p className="whitespace-normal">{children}</p>
  }

  // Origin reference
  if (matchRef) {
    return <LiParser liProps={pProps} isListItem={false} />
  }

  return <p>{children}</p>
}

export default PParser
