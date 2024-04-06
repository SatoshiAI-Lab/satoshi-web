import React from 'react'
import { useRouter } from 'next/router'

import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface HyperTextAProps {
  page: string
  mid: string | number
}

interface AParserProps {
  aProps: Omit<
    React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    'ref'
  > &
    ReactMarkdownProps &
    Partial<HyperTextAProps>
}

function AParser(props: AParserProps) {
  const {
    aProps: { children, href },
  } = props
  const router = useRouter()

  const handleClick = () => {
    const { page, mid = '' } = props.aProps
    page && router.push(page, { query: { mid } })
  }

  return (
    <a
      target="_blank"
      className={`
        no-underline cursor-pointer
        text-primary
      `}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

export default AParser
