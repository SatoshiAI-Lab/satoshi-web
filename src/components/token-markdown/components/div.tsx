import React, { ReactNode } from 'react'
import { first } from 'lodash'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

import { useTokenCustomData } from '@/hooks/use-token-custom-data'
import { ReferenceTag } from '@/components/reference-tag'

interface Props extends ReactMarkdownProps {}

const parseReference = (nodes: ReactNode[]) => {
  try {
    const metaStr = first(nodes) as string
    // TODO: parse a tag error.
    console.log('parse', nodes, metaStr)
    return JSON.parse(metaStr)
  } catch (error) {
    console.error('parseReference error: ', error)
    return []
  }
}

export const Div = (props: Props) => {
  const { node, children } = props
  const { getTokenData, getRefData } = useTokenCustomData()

  if (getRefData(node.properties)) {
    const [num, refMeta] = parseReference(children)
    return <ReferenceTag num={num} meta={refMeta} />
  }

  // If is token message,
  // Remove `TokenMessages` temp added newline.
  if (getTokenData(node?.properties)) {
    const result = children.map((c) =>
      typeof c === 'string' ? c.replaceAll(/\n\s+/g, '') : c
    )
    return <div>{result}</div>
  }

  return <div>{children}</div>
}

export default Div
