import React from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import ShowMoreText from 'react-show-more-text'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'
import { Avatar, IconButton } from '@mui/material'
import { IoLogoTwitter } from 'react-icons/io5'
import { isEmpty } from 'lodash'

import type { TokenInfoRes } from '@/api/token/types'

import { utilFmt } from '@/utils/format'
import { link } from '@/config/link'
import { MessageBubble } from '../../message-bubble'
import { PercentTag } from '@/components/percent-tag'

interface Props {
  info: TokenInfoRes
  avatarSize?: number
}

export const TokenQueryMessage = (props: Props) => {
  const { info, avatarSize = 45 } = props
  const { t } = useTranslation()
  const priceChange = Number(info.price_change)

  if (isEmpty(info)) {
    return <MessageBubble>{t('no.token-info')}</MessageBubble>
  }

  return (
    <MessageBubble className="min-w-bubble-sm">
      <div className="flex items-stretch">
        <Avatar
          src={info.logo}
          alt="logo"
          sx={{ width: avatarSize, height: avatarSize }}
          children={info.name?.charAt(0)}
        />
        <div className="ml-2 w-full flex flex-col justify-between">
          <p className="font-bold">{info.symbol}</p>
          {info.description && (
            <ShowMoreText
              anchorClass="text-primary cursor-pointer block text-sm"
              lines={1}
              more={t('bubble.show.more')}
              less={t('bubble.show.hide')}
            >
              {info.description}
            </ShowMoreText>
          )}
        </div>
      </div>
      <div className="flex items-center mt-2 mb-1">
        <div className="font-bold">${utilFmt.token(Number(info.price))}</div>
        <PercentTag className="font-bold ml-4" percent={priceChange} />
      </div>
      <div className="my-2 grid grid-cols-2 grid-rows-2 gap-2">
        <div>
          {t('lp')}
          {numeral(info.liquidity).format('0a.00').toUpperCase()}
        </div>
        <div>
          {t('holder')}
          {numeral(info.holders).format('0,0').toUpperCase()}
        </div>
        <div>
          {t('mkt-cap')}
          {numeral(info.market_cap).format('0a.00').toUpperCase()}
        </div>
        <div>
          {t('volume')}
          {numeral(info.volume).format('0a.0').toUpperCase()}
        </div>
      </div>
      {/* Websites */}
      <div className="flex -ml-2">
        <IconButton
          disabled={!info.twitter}
          onClick={() => window.open(`${link.twitter}${info.twitter}`)}
          color="primary"
        >
          <IoLogoTwitter />
        </IconButton>
        <IconButton
          disabled={!info.telegram}
          onClick={() => window.open(`${link.tg}${info.telegram}`)}
          color="primary"
          className="!mx-2"
        >
          <FaTelegramPlane />
        </IconButton>
        <IconButton
          disabled={!info.websites?.length}
          onClick={() => window.open(info.websites?.[0])}
          color="primary"
        >
          <RiGlobalLine />
        </IconButton>
      </div>
    </MessageBubble>
  )
}
