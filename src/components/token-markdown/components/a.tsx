import React from 'react'
import { useRouter } from 'next/router'

interface HyperTextAProps {
  page: string
  mid: string | number
}

interface Props extends React.ComponentProps<'a'>, Partial<HyperTextAProps> {}

export const A = (props: Props) => {
  const { children, href, page, mid } = props
  const router = useRouter()

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    return
  }

  return (
    <a
      className="no-underline cursor-pointer text-primary"
      target="_blank"
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export default A
