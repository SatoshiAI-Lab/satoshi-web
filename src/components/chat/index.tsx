import React, { useRef } from 'react'

import { utilFmt } from '@/utils/format'

function Chat(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = '' } = props
  const chatRef = useRef<HTMLDivElement | null>(null)

  return (
    <div
      className={utilFmt.classes(
        'flex relative max-sm:px-0 max-lg:pl-6 h-body',
        className
      )}
    >
      <div
        className={utilFmt.classes(
          'w-80 bottom-0 left-0 max-md:absolute max-lg:self-end',
          'max-md:h-4/5 max-lg:h-full max-lg:w-20'
        )}
      ></div>
      <div
        className={utilFmt.classes(
          'grow-[8] overflow-auto pb-0 pr-0',
          'flex flex-col gap-4 z-10 max-sm:pr-0'
        )}
      >
        <div
          className={utilFmt.classes(
            'flex flex-col items-start grow',
            'overflow-auto z-10 max-sm:ml-20'
          )}
          ref={chatRef}
        ></div>
      </div>
    </div>
  )
}

export default Chat
