import React from 'react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { Avatar } from '@mui/material'

import { MessageBubble } from '../message-bubble'
import { utilFmt } from '@/utils/format'
import { useMessagesContext } from '@/contexts/messages'
import { CopyAddr } from '@/components/copy-addr'
import { MetaType } from '@/api/chat/types'

export const WalletBubble = () => {
  const { t } = useTranslation()
  const { getMetaData } = useMessagesContext()
  const data = getMetaData<MetaType.MonitorWallet>()

  // console.log('data', data)

  return (
    <MessageBubble className={clsx('min-w-[400px] py-3')}>
      {/* Avatar, chain */}
      <div className="flex items-center">
        <Avatar src={data.logo} className="mr-2">
          {data.name.charAt(0)}
        </Avatar>
        <div className="flex flex-col justify-between">
          <span className="font-bold">
            {t('walletbubble.title').replace('$1', data.name ?? '')}
          </span>
          <span className="text-gray-400">
            {dayjs(data.created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Event description */}
      <div className="mt-2">
        <a href="#" target="_blank" className="underline text-primary mr-1">
          {data.name}
        </a>
        {t('swap')}
        <a href="#" target="_blank" className="text-primary mx-1">
          {data.currency_symbol}
        </a>
        ({data.currency_amount}) {t('for')} {utilFmt.token(data.side_amount)}{' '}
        {data.side_symbol}
      </div>
      {/* Contract address */}
      <CopyAddr
        addr={data.sender}
        prefix={
          <span className="font-bold mr-1">
            {data.currency_symbol} {t('ca')}:
          </span>
        }
        iconSize={16}
      />
      {/* Transaction hash */}
      <a href={data.hash_url} target="_blank" className="text-primary">
        {t('tx-hash')}
      </a>
    </MessageBubble>
  )
}

export default WalletBubble
