import React from 'react'
import { clsx } from 'clsx'

import type { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react'

interface Props extends ReactMarkdownProps {}

export const Li = (props: Props) => {
  const { children } = props

  return <li className={clsx('leading-7')}>{children}</li>
}

export default Li
