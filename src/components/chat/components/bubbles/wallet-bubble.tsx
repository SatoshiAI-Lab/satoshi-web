import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { MdOutlineContentCopy } from 'react-icons/md'
import toast from 'react-hot-toast'

import MessageBubble from './message-bubble'
import CopyToClipboard from 'react-copy-to-clipboard'

interface WalletBubbleProps extends React.ComponentProps<'div'> {}

const WalletBubble = (props: WalletBubbleProps) => {
  const { className } = props
  const { t } = useTranslation()

  return (
    <MessageBubble className={clsx('min-w-bubble py-4', className)}>
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        <img
          src="/images/i1.png"
          alt="avatar"
          className="w-12 h-12 rounded mr-2"
        />
        <div className="flex flex-col justify-between ">
          <span className="font-bold">name</span>
          <span className="text-gray-400">time</span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2">
        <a href="#" target="_blank" className="underline text-primary">
          Anatoly
        </a>{' '}
        sol{' '}
        <a href="#" target="_blank" className="text-primary">
          CAT
        </a>
        (123,456) for SOL
      </div>
      {/* contract address */}
      <div className="flex items-center my-1">
        <div className="mr-2">
          <span className="font-bold">CAT CA</span>: Lyex..w3hn
        </div>
        <CopyToClipboard
          text="Lyex..w3hn"
          onCopy={() => {
            toast.success(t('copy-success'))
          }}
        >
          <MdOutlineContentCopy className="cursor-pointer" />
        </CopyToClipboard>
      </div>
      {/* Transaction hash */}
      <a
        href="https://solscan.io/tx/1234567890"
        target="_blank"
        className="text-primary"
      >
        Tx hash
      </a>
    </MessageBubble>
  )
}

export default WalletBubble
