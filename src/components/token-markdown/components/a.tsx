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

  const handleClick = () => {
    if (page) {
      router.push(page, { query: { mid } })
    }
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

export default A
