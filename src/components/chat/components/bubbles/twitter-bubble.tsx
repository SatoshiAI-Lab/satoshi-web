import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'

interface TwitterBubbleProps extends React.ComponentProps<'div'> {}

const TwitterBubble = (props: TwitterBubbleProps) => {
  const { className } = props

  return (
    <MessageBubble className={clsx('min-w-bubble pt-4', className)}>
      {/* Avatar, name */}
      <div className="flex items-stretch">
        <img
          src="/images/i1.png"
          alt="avatar"
          className="w-12 h-12 rounded-full mr-2"
        />
        <div className="flex flex-col justify-between">
          <span className="font-bold">Elon Musk just tweeted</span>
          <span className="text-gray-400">1:23 4/2</span>
        </div>
      </div>
      {/* Text content */}
      <div className="my-2">
        Only 379,000 births in Italy for 2023, the lowest annual figure since
        the country's unification in 1861.
      </div>
      {/* TODO: click img to enlarge show. */}
      <img
        src="/images/i2.png"
        alt="img"
        className="rounded-md max-h-[300px] max-w-[300px]"
      />
      <a href="#" target="_blank" className="text-primary inline-block mt-3">
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default TwitterBubble
