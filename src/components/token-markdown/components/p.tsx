import React from 'react'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'
import type { Element as HElement } from 'hast'

import { useTokenCustomData } from '@/hooks/use-token-custom-data'

export interface Props extends ReactMarkdownProps {}

export const P = (props: Props) => {
  const { children, node, ...restProps } = props
  const { getLinkData } = useTokenCustomData()

  if (children === undefined) return <></>

  const link = node.children.find((e) => (e as HElement).tagName === 'a') as
    | HElement
    | undefined

  // If have token related, clear whitespace.
  if (getLinkData(link?.properties)) {
    return (
      <p {...restProps} className="whitespace-normal">
        {children}
      </p>
    )
  }

  return <p {...restProps}>{children}</p>
}

export default P
