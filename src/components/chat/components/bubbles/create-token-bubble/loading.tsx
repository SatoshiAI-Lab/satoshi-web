import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import MessageBubble from '../message-bubble'

const CreateTokenLoading = () => {
  const { t } = useTranslation()

  return (
    <MessageBubble
      className={clsx(
        'w-[550px] flex flex-col items-center justify-center',
        'bg-white pb-4'
      )}
    >
      <div>{t('create-token.loading')}</div>
      <div className="my-2">{t('create-token.loading-desc')}</div>
      <video
        src="/videos/loading.mp4"
        muted
        loop
        autoPlay
        className="w-48 h-48 object-cover"
      ></video>
    </MessageBubble>
  )
}

export default CreateTokenLoading
