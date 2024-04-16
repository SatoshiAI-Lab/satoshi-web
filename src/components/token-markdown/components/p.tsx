import React from 'react'

import Li from './li'
import { CHAT_CONFIG } from '@/config/chat'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'
import type { Element as HElement } from 'hast'

export interface Props extends ReactMarkdownProps {}

export const P = (props: Props) => {
  const { children, node } = props
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
    return <Li {...props} isListItem={false} />
  }

  return <p>{children}</p>
}

export default P
