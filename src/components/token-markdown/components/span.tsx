import React from 'react'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

import { PercentTag } from '@/components/percent-tag'
import { useTokenCustomData } from '@/hooks/use-token-custom-data'

interface Props extends ReactMarkdownProps {}

export const Span = (props: Props) => {
  const { node, children, ...restProps } = props
  const { getPercentData } = useTokenCustomData()
  const percent = getPercentData(node.properties) as string

  if (percent) {
    return <PercentTag percent={parseInt(percent)} block />
  }

  return <span {...restProps}>{children}</span>
}

export default Span
