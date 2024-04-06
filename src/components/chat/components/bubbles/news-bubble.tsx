import React from 'react'
import clsx from 'clsx'

import MessageBubble from './message-bubble'

interface NewsBubbleProps extends React.ComponentProps<'div'> {}

const NewsBubble = (props: NewsBubbleProps) => {
  const { className } = props

  return (
    <MessageBubble className={clsx('min-w-bubble pt-4', className)}>
      <div className="font-bold text-lg">
        DWF Lianchuang: The total market value of the crypto market is rising,
        but spot trading volume has dropped significantly. The Bitcoin halving
        may bring huge fluctuations to the market.
      </div>
      <div className="my-2 text-gray-400">1:23 4/2</div>
      <div>
        According to BlockBeats news, on April 1, Andrei Grachev, co-founder of
        DWF Labs, posted that, “Although the total market value of the crypto
        market is slowly rising (up 16% month-on-month), spot trading volume is
        declining (down 44% month-on-month). Overall, In other words, more and
        more cryptocurrencies are being traded and distributed to holders who
        are waiting for some event that may bring huge volatility (like the
        Bitcoin halving?). It’s an interesting phenomenon.”
      </div>
      {/* TODO: click img to enlarge show. */}
      <img
        src="/images/i2.png"
        alt="image"
        className="max-w-[300px] max-h-[300px] rounded mt-2"
      />
      <a href="#" target="_blank" className="text-primary inline-block mt-3">
        Origin Link
      </a>
    </MessageBubble>
  )
}

export default NewsBubble
