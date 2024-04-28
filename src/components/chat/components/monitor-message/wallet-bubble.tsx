import React from 'react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { MessageBubble } from '../message-bubble'
import { link } from '@/config/link'
import { utilFmt } from '@/utils/format'
import { useMessagesContext } from '@/contexts/messages'
import { CopyAddr } from '@/components/copy-addr'

export const WalletBubble = () => {
  const { t } = useTranslation()
  const { message } = useMessagesContext()
  const {
    created_at,
    name,
    sender,
    currency_symbol,
    side_amount,
    side_symbol,
    hash,
  } = message.meta || {}

  return (
    <MessageBubble className={clsx('min-w-[400px] py-4')}>
      {/* Avatar, chain */}
      <div className="flex items-stretch">
        {/* <img
          src="/images/i1.png"
          alt="avatar"
          className="w-12 h-12 rounded mr-2"
        /> */}
        <div className="flex flex-col justify-between ">
          <span className="font-bold">
            {t('walletbubble.title').replace('$1', name ?? '')}
          </span>
          <span className="text-gray-400">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2">
        <a href="#" target="_blank" className="underline text-primary">
          {name}
        </a>{' '}
        {t('swap')}
        <a href="#" target="_blank" className="text-primary">
          {' '}
          {currency_symbol}{' '}
        </a>
        {t('for')} {utilFmt.token(side_amount)} {side_symbol}
      </div>
      {/* contract address */}
      <CopyAddr
        addr={sender}
        prefix={<span className="font-bold mr-1">{side_symbol} CA:</span>}
        iconSize={16}
      />
      {/* Transaction hash */}
      <a
        href={`${link.solscan}tx/${hash}`}
        target="_blank"
        className="text-primary"
      >
        Tx hash
      </a>
    </MessageBubble>
  )
}

export default WalletBubble
