import { useState } from 'react'
import clsx from 'clsx'

import MessageBubble from '../bubbles/message-bubble'
import { ChatResponseMetaTwitter } from '@/api/chat/types'
import dayjs from 'dayjs'
import { t } from 'i18next'
import ShowMoreText from 'react-show-more-text'
import { Dialog } from '@mui/material'
import { utilLang } from '@/utils/language'

interface Props {
  data: ChatResponseMetaTwitter
}

const TwitterBubble = ({ data }: Props) => {
  const { content, created_at, twitter, tweets_id, twitter_logo, photo } = data
  const currentContent = utilLang.getContent(content)

  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string>()
  const showImage = (item: string) => {
    setImage(item)
    setOpen(true)
  }

  return (
    <MessageBubble
      className={clsx(
        'w-bubble pt-[12px] pr-[14px] pb-[15px] pl-[18px] flex flex-col'
      )}
    >
      {/* Avatar, name */}
      <div className="flex items-stretch max-h-[40px] overflow-hidden">
        <img
          src={twitter_logo}
          alt="avatar"
          className="w-[40px] h-[40px] rounded-full mr-[8px]"
        />
        <div className="flex flex-col justify-between">
          <span className="font-bold text-[14px]">
            {twitter} {t('bubble.new-tweet')}
          </span>
          <span className="text-[#10101040] text-[14px]">
            {dayjs(created_at).format('H:mm M/D')}
          </span>
        </div>
      </div>
      {/* Text content */}
      <ShowMoreText
        anchorClass="text-primary cursor-pointer block text-sm w-fit ml-auto"
        className="mt-[11px] mb-[15px]"
        lines={4}
        more={t('bubble.show.more')}
        less={t('bubble.show.hide')}
      >
        {currentContent}
      </ShowMoreText>
      {photo.map((item) => (
        <img
          key={item}
          src={item}
          onClick={() => showImage(item)}
          alt="img"
          className="rounded-md max-h-[300px] max-w-[300px] mb-[15px] cursor-pointer"
        />
      ))}
      <a
        href={`https://twitter.com/${twitter}/status/${tweets_id}`}
        target="_blank"
        className="text-primary inline-block w-fit"
      >
        {t('bubble.originlink')}
      </a>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <img src={image} alt="img" className="max-h-[600px] max-w-[600px]" />
      </Dialog>
    </MessageBubble>
  )
}

export default TwitterBubble
