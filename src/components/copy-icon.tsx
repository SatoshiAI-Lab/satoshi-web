import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import { MdContentCopy } from 'react-icons/md'
import { clsx } from 'clsx'

import { useClipboard } from '@/hooks/use-clipboard'

interface Props extends React.ComponentProps<'svg'> {
  text: string | undefined
  size?: number
}

export const CopyIcon = (props: Props) => {
  const { text = '', size = 18, className, ...restProps } = props
  const { isCopied, copy } = useClipboard()

  return isCopied ? (
    <FaCheck size={size} className={className} {...restProps} />
  ) : (
    <MdContentCopy
      className={clsx('cursor-pointer', className)}
      size={size}
      onClick={() => copy(text)}
      {...restProps}
    />
  )
}

export default CopyIcon
