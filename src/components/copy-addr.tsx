import React, { ReactNode } from 'react'
import { clsx } from 'clsx'

import { CopyIcon } from './copy-icon'
import { utilFmt } from '@/utils/format'

interface Props extends Omit<React.ComponentProps<'span'>, 'prefix'> {
  addr: string | undefined
  fmt?: boolean
  prefix?: ReactNode
  iconSize?: number
  bold?: boolean
  containerClass?: string
  iconClass?: string
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
      <CopyIcon text={addr} size={iconSize} className={iconClass} />
    </div>
  )
}

export default CopyAddr
