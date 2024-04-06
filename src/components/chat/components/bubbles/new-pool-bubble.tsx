import React from 'react'
import clsx from 'clsx'
import { MdOutlineContentCopy } from 'react-icons/md'

import MessageBubble from './message-bubble'
import CopyToClipboard from 'react-copy-to-clipboard'

interface NewPoolBubbleProps extends React.ComponentProps<'div'> {}

const NewPoolBubble = (props: NewPoolBubbleProps) => {
  const { className } = props
  // If value is null, it's will be not displayed.
  const rows = [
    {
      label: 'Token',
      value: 'LILCAT',
    },
    {
      label: 'LIquidity',
      value: '$23233',
    },
    {
      label: 'Pair',
      value: 'LILCAT/SOL',
    },
    {
      label: 'CA',
      value: 'AX23..YUIP',
      link: 'https://www.solscan.com/',
      copyable: true,
    },
    {
      label: 'Twitter',
      value: '@elonmusk',
      link: 'https://x.com/elonmusk',
    },
    {
      label: 'Telegram',
      value: '@elonmusk',
      link: 'https://tg.com/elonmusk',
    },
  ]

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
      <img src="/images/i2.png" alt="img" className="rounded w-16 h-16 my-3" />
      {rows.map((r, i) =>
        r.value ? (
          <div className="flex items-center mb-2" key={i}>
            <span className="font-bold">{r.label}</span>:{' '}
            {r.link ? (
              <a href={r.link} target="_blank" className="text-primary ml-1">
                {r.value}
              </a>
            ) : (
              r.value
            )}
            {r.copyable && (
              <CopyToClipboard text={r.value}>
                <MdOutlineContentCopy className="ml-2 cursor-pointer" />
              </CopyToClipboard>
            )}
          </div>
        ) : (
          <></>
        )
      )}
    </MessageBubble>
  )
}

export default NewPoolBubble
