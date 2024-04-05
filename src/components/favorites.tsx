import React from 'react'

import { utilFmt } from '@/utils/format'

function Favorites(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = '' } = props

  return (
    <div
      className={utilFmt.classes(
        'bg-favorite dark:bg-favorite-dark py-2 text-sm max-lg:hidden',
        className
      )}
    >
      <div className="flex justify-between items-center px-4 w-favorites"></div>
    </div>
  )
}

export default Favorites
