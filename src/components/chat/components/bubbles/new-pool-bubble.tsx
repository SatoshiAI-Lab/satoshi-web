import React from 'react'
import clsx from 'clsx'
import { MdOutlineContentCopy } from 'react-icons/md'
import { FaTwitter } from 'react-icons/fa'
import { FaTelegramPlane } from 'react-icons/fa'
import { GrLanguage } from 'react-icons/gr'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import MessageBubble from './message-bubble'
import { IconButton } from '@mui/material'
import { utilFmt } from '@/utils/format'
import { useClipboard } from '@/hooks/use-clipboard'
import { ChatResponseMetaNewPool } from '@/api/chat/types'

const NewPoolBubble = ({ ...props }: ChatResponseMetaNewPool) => {
  const { t } = useTranslation()
  const { copy } = useClipboard()

  return (
    <MessageBubble className={clsx('min-w-bubble pt-4 w-[500px]')}>
      {/* Avatar, name */}
      <div className="flex justify-between">
        <div className="flex items-stretch">
          <img
            src="/images/i1.png"
            alt="avatar"
            className="w-12 h-12 rounded-full mr-2"
          />
          <div className="flex flex-col justify-between">
            <span className="font-bold leading-none">
              {t('new-pool').replace('{}', 'Solana')}
            </span>
            <span className="text-gray-400 text-sm">
              {dayjs(props.created_at).format('H:mm M/D')}
            </span>
          </div>
        </div>
        <img
          src="/images/i2.png"
          alt="img"
          className="rounded-md w-[48px] h-[48px] border border-gray-300"
        />
      </div>
      <div className="font-bold mt-3 mb-1 flex justify-between items-center">
        <span>
          {props.symbol}({props.name})
        </span>
        <div className="flex items-center">
          {true && (
            <IconButton
              onClick={() => window.open(props.twitter)}
              title="Twitter"
            >
              <FaTwitter className="text-secondary" size={20} />
            </IconButton>
          )}
          {true && (
            <IconButton
              onClick={() => window.open(props.telegram)}
              title="Telegram"
            >
              <FaTelegramPlane className="text-secondary" size={22} />
            </IconButton>
          )}
          <IconButton
            onClick={() => window.open(props.website)}
            title="Website"
          >
            <GrLanguage className="text-secondary" size={20} />
          </IconButton>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold">{t('ca')}:</span>{' '}
        <a href={'#'} target="_blank" className="text-primary ml-1 underline">
          {utilFmt.addr(props.address)}
        </a>
        <MdOutlineContentCopy
          className="ml-3 cursor-pointer"
          onClick={() => copy(props.address)}
        />
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('liquidity')}:</span>
        <span>$${props.liquidity}</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('started')}:</span>{' '}
        <span>${props.started}</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('price')}:</span>
        <span>${props.price}</span>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <div className="font-bold mt-2">⚙️ {t('ca-secutiry')}</div>
          {Object.keys(props.security).map((key) => (
            <div className="mt-2" key={key}>
              {key}: {props.security[key]}
            </div>
          ))}
        </div>
        <div className="ml-4">
          <div className="font-bold mt-2">🏦 {t('top-holders')}</div>
          {Object.keys(props.top_holders).map((key) => (
            <div className="mt-2" key={key}>
              {key}: {props.top_holders[key]}
            </div>
          ))}
          <div></div>
        </div>
        <div className="my-2">
          <div className="font-bold mt-2">
            🧠 {t('score')}: {t(props.score.score)}
          </div>
          {props.score.detail.map((item) => (
            <div className="mt-2" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </MessageBubble>
  )
}

export default NewPoolBubble
