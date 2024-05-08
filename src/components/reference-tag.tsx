import React from 'react'
import { clsx } from 'clsx'
import { Tooltip, Zoom } from '@mui/material'

import type { ChatMetaReference } from '@/api/chat/types'

interface Props {
  num: number
  meta: ChatMetaReference
}

export const ReferenceTag = (props: Props) => {
  const { num, meta } = props

  return (
    <Tooltip
      classes={{
        tooltip: clsx(
          '!bg-[rgba(0,0,0,0.9)] !text-sm overflow-auto',
          '!p-2 max-h-[45vh] !max-w-[80vw]'
        ),
        arrow: 'before:!bg-[rgba(0,0,0,0.9)]',
      }}
      TransitionComponent={Zoom}
      disableFocusListener
      title={
        <div>
          <p className="text-zinc-200">{meta.published_at}</p>
          <a
            target={meta.url && 'blank'}
            href={meta.url || '#'}
            className={clsx('hover:underline hover:text-secondary')}
          >
            {meta.content}
          </a>
        </div>
      }
    >
      <sup
        className={clsx(
          'bg-primary text-white hover:bg-primary-deep',
          'text-xs ml-1 cursor-pointer px-1 rounded no-underline'
        )}
      >
        {num}
      </sup>
    </Tooltip>
  )
}

export default ReferenceTag
