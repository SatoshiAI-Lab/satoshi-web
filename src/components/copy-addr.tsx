import React, { ReactNode } from 'react'
import { clsx } from 'clsx'

import { CopyIcon } from './copy-icon'
import { utilFmt } from '@/utils/format'

interface Props extends Omit<React.ComponentProps<'div'>, 'prefix'> {
  addr: string | undefined
  fmt?: boolean
  prefix?: ReactNode
  iconSize?: number
}

export const CopyAddr = (props: Props) => {
  const { addr, className, fmt = true, prefix, iconSize } = props

  return (
    <div className={clsx('flex items-center', className)}>
      {prefix}
      <span className="mr-2">{fmt ? utilFmt.addr(addr) : addr}</span>
      <CopyIcon text={addr} size={iconSize} />
    </div>
  )
}

export default CopyAddr
