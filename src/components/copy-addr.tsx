import React, { ReactNode } from 'react'
import { clsx } from 'clsx'

import { CopyIcon } from './copy-icon'
import { utilFmt } from '@/utils/format'

interface Props
  extends Omit<React.ComponentProps<'span'>, 'prefix' | 'onCopy'> {
  addr: string | undefined
  fmt?: boolean
  prefix?: ReactNode
  iconSize?: number
  bold?: boolean
  containerClass?: string
  iconClass?: string
  onCopy?: React.MouseEventHandler<SVGElement>
}

export const CopyAddr = (props: Props) => {
  const {
    addr,
    className,
    fmt = true,
    prefix,
    iconSize,
    bold = false,
    containerClass,
    iconClass,
    onCopy,
    ...restProps
  } = props

  return (
    <div className={clsx('flex items-center', containerClass)}>
      {prefix}
      <span
        className={clsx('mr-2', bold && 'font-bold', className)}
        {...restProps}
      >
        {fmt ? utilFmt.addr(addr) : addr}
      </span>
      <CopyIcon
        text={addr}
        size={iconSize}
        className={iconClass}
        onClick={onCopy}
      />
    </div>
  )
}

export default CopyAddr
