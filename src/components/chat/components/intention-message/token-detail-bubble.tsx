import {
  ChatResponseAnswerMeta,
  ChatResponseTokenDetail,
} from '@/api/chat/types'
import MessageBubble from '../message-bubble'
import { Avatar, IconButton } from '@mui/material'
import { IoArrowDown, IoArrowUp, IoLogoTwitter } from 'react-icons/io5'
import { utilFmt } from '@/utils/format'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import ShowMoreText from 'react-show-more-text'
import { link } from '@/config/link'

interface Props {
  msg?: ChatResponseAnswerMeta
}

export const TokenDetailBubble = (props: Props) => {
  const data = props.msg?.data as unknown as ChatResponseTokenDetail
  console.log(data)
  const { t } = useTranslation()

  const priceCange = Number(data.price_change)

  return (
    <MessageBubble>
      <div className="flex">
        <Avatar src={data.logo} alt="Logo" sx={{ width: 30, height: 30 }}>
          {data.name.slice(0, 1)}
        </Avatar>
        <div className="ml-2 w-full flex flex-col justify-center">
          <div>{data.symbol}</div>

          {data.description && (
            <ShowMoreText
              anchorClass="text-primary cursor-pointer block text-sm"
              lines={1}
              more={t('bubble.show.more')}
              less={t('bubble.show.hide')}
            >
              {data.description}
            </ShowMoreText>
          )}
        </div>
      </div>
      <div className="flex items-center my-1">
        <div className="font-bold">${utilFmt.token(Number(data.price))}</div>
        <div className="flex items-center ml-5 font-bold text-yellow-600">
          {priceCange < 0 ? (
            <IoArrowDown></IoArrowDown>
          ) : (
            <IoArrowUp></IoArrowUp>
          )}
          {Math.abs(priceCange)}%
        </div>
      </div>
      <div className="my-2 grid grid-cols-2 grid-rows-2 gap-2">
        <div>
          {t('lp')}
          {numeral(data.liquidity).format('0a.00').toUpperCase()}
        </div>
        <div>
          {t('holder')}
          {numeral(data.holders).format('0,0').toUpperCase()}
        </div>
        <div>
          {t('mkt-cap')}
          {numeral(data.market_cap).format('0a.00').toUpperCase()}
        </div>
        <div>
          {t('volume')}
          {numeral(data.volume).format('0a.0').toUpperCase()}
        </div>
      </div>
      <div className="flex -ml-2">
        <IconButton
          disabled={!data.twitter}
          onClick={() => window.open(`${link.twitter}${data.twitter}`)}
          color="primary"
        >
          <IoLogoTwitter></IoLogoTwitter>
        </IconButton>
        <IconButton
          disabled={!data.telegram}
          onClick={() => window.open(`${link.tg}${data.telegram}`)}
          color="primary"
          className="!mx-2"
        >
          <FaTelegramPlane></FaTelegramPlane>
        </IconButton>
        <IconButton
          disabled={!data.websites.length}
          onClick={() => window.open(data.websites[0])}
          color="primary"
        >
          <RiGlobalLine></RiGlobalLine>
        </IconButton>
      </div>
    </MessageBubble>
  )
}
