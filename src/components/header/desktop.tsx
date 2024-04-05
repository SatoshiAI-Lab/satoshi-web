import React from 'react'

import { utilFmt } from '@/utils/format'

interface DesktopHeaderProps {
  items: string[]
}

function DesktopHeader(props: DesktopHeaderProps) {
  const { items } = props

  const onItemClick = (item: string) => {}

  return (
    <ul
      className={utilFmt.classes(
        'flex text-black max-lg:hidden list-none ml-10',
        'dark:text-white'
      )}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className={utilFmt.classes(
            'cursor-pointer shrink-0 transition-all mr-10',
            'hover:text-primary'
          )}
          onClick={() => onItemClick(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export default DesktopHeader
