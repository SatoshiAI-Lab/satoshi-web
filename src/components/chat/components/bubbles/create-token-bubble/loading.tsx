import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import MessageBubble from '../message-bubble'
import { Button } from '@mui/material'

const CreateTokenLoading = (props: {
  isMinting: boolean
  isLongTime: boolean
  onCancel?: () => void
}) => {
  const { isMinting, isLongTime, onCancel } = props
  const { t } = useTranslation()

  return (
    <MessageBubble
      className={clsx(
        'w-bubble flex flex-col items-center justify-center',
        'bg-white pb-4'
      )}
    >
      <div>
        {isMinting ? t('minting-token.loading') : t('create-token.loading')}
      </div>
      <div className="my-2">{t('create-token.loading-desc')}</div>
      <video
        src="/videos/loading.mp4"
        muted
        loop
        autoPlay
        className="w-48 h-48 object-cover mb-4"
      ></video>
      {isLongTime && (
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </MessageBubble>
  )
}

export default CreateTokenLoading
