import React from 'react'
import clsx from 'clsx'

import { HeaderItem } from '../types'

interface DesktopHeaderProps {
  items: HeaderItem[]
  onItemClick?: (item: HeaderItem) => void
}

function DesktopHeader(props: DesktopHeaderProps) {
  const { items, onItemClick } = props

  return (
    <ul
      className={clsx(
        'flex text-black max-lg:hidden list-none ml-10',
        'dark:text-white'
      )}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className={clsx(
            'cursor-pointer shrink-0 transition-all mr-10',
            'hover:text-primary'
          )}
          onClick={() => onItemClick?.(item)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export default DesktopHeader
