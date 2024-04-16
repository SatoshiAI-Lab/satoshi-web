import React from 'react'

import PercentTag from '@/components/percent-tag'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface Props extends ReactMarkdownProps {}

export const Span = (props: Props) => {
  const { node, children } = props
  const isPercentTag = node.properties?.hasOwnProperty('dataPercentTag')
  const { dataPercentTag } = node.properties ?? {}

  if (isPercentTag) {
    return <PercentTag percent={parseInt(dataPercentTag as string)} block />
  }

  return <span>{children}</span>
}

export default Span
