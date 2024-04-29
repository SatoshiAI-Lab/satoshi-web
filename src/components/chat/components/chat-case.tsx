import React from 'react'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

import { useChatStore } from '@/stores/use-chat-store'

interface Props extends React.ComponentProps<'div'> {
  text: string
}

export const ChatCase = (props: Props) => {
  const { text, className, children } = props
  const { t } = useTranslation()
  const { chatInputEl, setQuestion } = useChatStore()

  return (
    <div className={clsx('flex items-center', className)}>
      <span>
        {t('try-say')}: "{text}"
      </span>
      {children}
      <Button
        variant="outlined"
        size="small"
        className="!ml-2"
        classes={{ root: '!py-0.5 !text-xs' }}
        onClick={() => {
          setQuestion(text)
          chatInputEl?.focus()
        }}
      >
        {t('use-it')}
      </Button>
    </div>
  )
}

export default ChatCase
