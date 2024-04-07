import React from 'react'
import clsx from 'clsx'
import { MdOutlineContentCopy } from 'react-icons/md'
import { FaTwitter } from 'react-icons/fa'
import { FaTelegramPlane } from 'react-icons/fa'
import { GrLanguage } from 'react-icons/gr'
import { useTranslation } from 'react-i18next'

import MessageBubble from './message-bubble'
import { IconButton } from '@mui/material'
import { utilFmt } from '@/utils/format'
import { useClipboard } from '@/hooks/use-clipboard'

interface NewPoolBubbleProps extends React.ComponentProps<'div'> {}

const NewPoolBubble = (props: NewPoolBubbleProps) => {
  const { className } = props
  const { t } = useTranslation()
  const { copy } = useClipboard()

  return (
    <MessageBubble className={clsx('min-w-bubble pt-4 w-[500px]', className)}>
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
            <span className="text-gray-400 text-sm">1:23 4/2</span>
          </div>
        </div>
        <img
          src="/images/i2.png"
          alt="img"
          className="rounded-md w-[48px] h-[48px] border border-gray-300"
        />
      </div>
      <div className="font-bold mt-3 mb-1 flex justify-between items-center">
        <span>LILCAT(LONG LILCAT)</span>
        <div className="flex items-center">
          {true && (
            <IconButton onClick={() => {}} title="Twitter">
              <FaTwitter className="text-secondary" size={20} />
            </IconButton>
          )}
          {true && (
            <IconButton onClick={() => {}} title="Telegram">
              <FaTelegramPlane className="text-secondary" size={22} />
            </IconButton>
          )}
          <IconButton onClick={() => {}} title="Website">
            <GrLanguage className="text-secondary" size={20} />
          </IconButton>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold">{t('ca')}:</span>{' '}
        <a href={'#'} target="_blank" className="text-primary ml-1 underline">
          {utilFmt.addr('AX23..YUIP')}
        </a>
        <MdOutlineContentCopy
          className="ml-3 cursor-pointer"
          onClick={() => copy('AX23..YUIP')}
        />
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('liquidity')}:</span>
        <span>$23235</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('started')}:</span>{' '}
        <span>12.0 SOL + 90%</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('price')}:</span>
        <span>$0.000000323</span>
      </div>

      <div className="grid grid-cols-2">
        <div>
          <div className="font-bold mt-2">⚙️ {t('ca-secutiry')}</div>
          <div className="mt-2">
            {t('mutable-metadata')}: {t('yes')} ⚠️
          </div>
          <div className="mt-2">
            {t('mint-auth')}: {t('yes')} ⚠️
          </div>
          <div className="mt-2">
            {t('freeze-auth')}: {t('yes')} ✅
          </div>
          <div className="mt-2">
            {t('lp-burned')}: {t('no')} ⚠️
          </div>
        </div>
        <div className="ml-4">
          <div className="font-bold mt-2">🏦 {t('top-holders')}</div>
          <div className="mt-2">
            🐳 {utilFmt.addr('Asdjaoiwdjaas')} | {utilFmt.percent(30.5)}
          </div>
          <div className="mt-2">
            🐳 {utilFmt.addr('Asdjaoiwdjaas')} | {utilFmt.percent(27.5)}
          </div>
          <div className="mt-2">
            🦐 {utilFmt.addr('Asdjaoiwdjaas')} | {utilFmt.percent(20.5)}
          </div>
          <div className="mt-2">
            🦐 {utilFmt.addr('Asdjaoiwdjaas')} | {utilFmt.percent(5.5)}
          </div>
          <div className="mt-2">
            🦐 {utilFmt.addr('Asdjaoiwdjaas')} | {utilFmt.percent(1.5)}
          </div>
          <div></div>
        </div>
        <div className="my-2">
          <div className="font-bold mt-2">
            🧠 {t('score')}: {t('bad')}
          </div>
          <div className="mt-2">🟥 {t('mint-auth-still')}</div>
          <div className="mt-2">
            🟥 {t('single-holder').replace('{}', '30%')}
          </div>
          <div className="mt-2">🟧 {t('mutable-metadata')}</div>
        </div>
      </div>
    </MessageBubble>
  )
}

export default NewPoolBubble
