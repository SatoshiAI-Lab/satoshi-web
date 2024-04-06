import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'

interface ExchangeAnnouncementBubbleProps extends React.ComponentProps<'div'> {}

// `ExAnnBubble` full name is: `Exchange Announcement Bubble`
const ExAnnBubble = (props: ExchangeAnnouncementBubbleProps) => {
  const { className } = props

  return (
    <MessageBubble className={clsx('min-w-bubble py-4', className)}>
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        <img
          src="/images/i1.png"
          alt="avatar"
          className="w-12 h-12 rounded-full mr-2"
        />
        <div className="flex flex-col justify-between ">
          <span className="font-bold">Binance just released a new ann.</span>
          <span className="text-gray-400">1:23 4/3</span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2 font-bold">
        Make Your First Futures Trade and Invite Your Referrals to Binance
        Futures to Share 700,000 ENA!
      </div>
      <a
        href="https://solscan.io/tx/1234567890"
        target="_blank"
        className="text-primary inline-block mt-2"
      >
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default ExAnnBubble
