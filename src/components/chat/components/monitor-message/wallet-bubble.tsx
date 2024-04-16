import React from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import CopyToClipboard from 'react-copy-to-clipboard'
import dayjs from 'dayjs'
import { IoCopyOutline } from 'react-icons/io5'

import { MessageBubble } from '../bubbles/message-bubble'
import { link } from '@/config/link'
import { utilFmt } from '@/utils/format'

import type { ChatResponseMetaWallet } from '@/api/chat/types'

interface Props {
  data: ChatResponseMetaWallet
}

const WalletBubble = ({ data }: Props) => {
  const {
    type,
    created_at,
    name,
    sender,
    currency_symbol,
    side_amount,
    side_symbol,
    hash,
  } = data
  const { t } = useTranslation()

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
            {t('walletbubble.title').replace('$1', name)}
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
      <div className="flex items-center my-1">
        <div className="mr-2">
          <span className="font-bold">{side_symbol} CA</span>:{' '}
          {utilFmt.addr(sender)}
        </div>
        <CopyToClipboard
          text={sender}
          onCopy={() => {
            toast.success(t('copy-success'))
          }}
        >
          <IoCopyOutline className="cursor-pointer" />
        </CopyToClipboard>
      </div>
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
