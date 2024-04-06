import React from 'react'

import PercentTag from '@/components/percent-tag'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface SpanParserProps {
  spanProps: Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >,
    'ref'
  > &
    ReactMarkdownProps
}

function SpanParser(props: SpanParserProps) {
  const {
    spanProps: { node, children },
  } = props
  const isPercentTag = node.properties?.hasOwnProperty('dataPercentTag')
  const { dataPercentTag } = node.properties ?? {}

  if (isPercentTag) {
    return <PercentTag percent={parseInt(dataPercentTag as string)} block />
  }

  return <span>{children}</span>
}

export default SpanParser
