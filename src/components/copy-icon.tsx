import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import { MdContentCopy } from 'react-icons/md'
import { clsx } from 'clsx'

import { useClipboard } from '@/hooks/use-clipboard'

interface Props extends React.ComponentProps<'svg'> {
  text: string | undefined
  size?: number
  onClick?: React.MouseEventHandler<SVGElement>
}

export const CopyIcon = (props: Props) => {
  const { text = '', size = 18, className, onClick, ...restProps } = props
  const { isCopied, copy } = useClipboard()

  return isCopied ? (
    <FaCheck size={size} className={className} {...restProps} />
  ) : (
    <MdContentCopy
      className={clsx('cursor-pointer', className)}
      size={size}
      onClick={(e) => {
        copy(text)
        onClick?.(e)
      }}
      {...restProps}
    />
  )
}

export default CopyIcon
