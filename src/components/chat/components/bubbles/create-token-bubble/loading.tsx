import React from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Button } from '@mui/material'

import MessageBubble from '../message-bubble'

interface Props {
  isMinting: boolean
  isLongTime: boolean
  onCancel?: () => void
}

const CreateTokenLoading = (props: Props) => {
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
          {t('cancel')}
        </Button>
      )}
    </MessageBubble>
  )
}

export default CreateTokenLoading
