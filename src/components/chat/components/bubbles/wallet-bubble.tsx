import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { MdOutlineContentCopy } from 'react-icons/md'
import toast from 'react-hot-toast'

import MessageBubble from './message-bubble'
import CopyToClipboard from 'react-copy-to-clipboard'
import { ChatResponseMetaWallet } from '@/api/chat/types'
import dayjs from 'dayjs'

const WalletBubble = ({
  type,
  created_at,
  name,
  sender,
  currency_symbol,
  side_amount,
  side_symbol,
}: ChatResponseMetaWallet) => {
  const { t } = useTranslation()

  return (
    <MessageBubble className={clsx('min-w-bubble py-4')}>
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        <img
          src="/images/i1.png"
          alt="avatar"
          className="w-12 h-12 rounded mr-2"
        />
        <div className="flex flex-col justify-between ">
          <span className="font-bold">{t('walletbubble.title')}</span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2">
        <a href="#" target="_blank" className="underline text-primary">
          {name}
        </a>
        {type}
        <a href="#" target="_blank" className="text-primary">
          {currency_symbol}
        </a>
        for {side_amount} {side_symbol}
      </div>
      {/* contract address */}
      <div className="flex items-center my-1">
        <div className="mr-2">
          <span className="font-bold">{side_symbol} CA</span>:
          {sender.substring(0, 4) + '...' + sender.substring(sender.length - 4)}
        </div>
        <CopyToClipboard
          text={sender}
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
