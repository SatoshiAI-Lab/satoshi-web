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
import { link } from '@/config/link'

const NewPoolBubble = ({ ...props }: ChatResponseMetaNewPool) => {
  const { t } = useTranslation()
  const { copy } = useClipboard()

  console.log(props);
  

  return (
    <MessageBubble className={clsx('min-w-bubble pt-4 w-[500px]')}>
      {/* Avatar, name */}
      <div className="flex justify-between">
        <div className="flex items-stretch gap-[8px]">
          {/* <img
            src="/images/i1.png"
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full"
          /> */}
          <div className="flex flex-col">
            <span className="font-bold h-[20px] leading-none">
              {t('new-pool').replace('{}', 'Solana')}
            </span>
            <span className="text-gray-400 h-[20px] text-sm">
              {dayjs(props.created_at).format('H:mm M/D')}
            </span>
          </div>
        </div>
        {/* <img
          src="/images/i2.png"
          alt="img"
          className="rounded-md w-[44px] h-[44px] border border-gray-300"
        /> */}
        <div className="font-bold -mt-4 mb-1 flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              onClick={() => window.open(props.twitter)}
              title="Twitter"
              color="primary"
              disabled={!props.twitter}
            >
              <FaTwitter size={20} />
            </IconButton>
            <IconButton
              onClick={() => window.open(props.telegram)}
              color="primary"
              title="Telegram"
              disabled={!props.telegram}
            >
              <FaTelegramPlane size={22} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => window.open(props.website)}
              title="Website"
              disabled={!props.website}
            >
              <GrLanguage size={20} />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="my-2 font-bold">
        {props.symbol}({props.name})
      </div>

      <div className="flex items-center mb-2">
        <span className="font-bold">{t('ca')}:</span>{' '}
        <a
          href={`${link.solscan}${props.address}`}
          target="_blank"
          className="text-primary ml-1 underline"
        >
          {utilFmt.addr(props.address)}
        </a>
        <MdOutlineContentCopy
          className="ml-3 cursor-pointer"
          onClick={() => copy(props.address)}
        />
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('liquidity')}:</span>
        <span>${props.liquidity}</span>
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
        {props.score.score && (
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
        )}
      </div>
    </MessageBubble>
  )
}

export default NewPoolBubble
