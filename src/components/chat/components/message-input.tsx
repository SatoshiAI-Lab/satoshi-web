import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPaperPlane } from 'react-icons/fa'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button, InputBase } from '@mui/material'
import { useKey } from 'react-use'
import clsx from 'clsx'

import InputMenu from './input-menu'
import { useInputHistory } from '@/hooks/use-input-history'

interface MessageInputProps {
  autofocus?: boolean
  onSend: () => void
}

function MessageInput(props: MessageInputProps) {
  const [question, setQuestion] = useState('')
  const { autofocus = true, onSend } = props
  const { t } = useTranslation()
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const isLoading = false

  const handleEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') return
    if (e.key !== 'Enter') return

    e.preventDefault()

    // Although is deprecated, but very useful.
    if (e.keyCode === 13) {
      onSend()
      return
    }
  }

  // Keyboard shortcut for focus.
  useKey('/', (e) => {
    if (isFocus) return
    e.preventDefault()
    inputRef?.current?.focus()
  })

  // Recorded input histroy.
  useInputHistory(inputRef, setQuestion)

  // Autofocus input.
  useEffect(() => {
    if (autofocus) {
      inputRef?.current?.focus()
    }
  }, [])

  return (
    <div className="sticky bottom-4 z-20 max-sm:mx-5 mr-10 max-sm:bottom-0 transition-all">
      <InputMenu />
      <div
        className={clsx(
          'flex rounded-md gap-2 border-2 border-solid items-center duration-500',
          'bg-slate-100 transition-all py-1 px-1 pl-2 hover:border-primary',
          isFocus ? 'border-primary' : 'border-transparent'
        )}
      >
        <InputBase
          classes={{
            root: '!pl-1 !text-lg !transition-all !text-black',
            input: '!transition-all !truncate ',
          }}
          value={question}
          placeholder={t('chat.placeholder')}
          multiline
          maxRows={5}
          minRows={1}
          fullWidth
          inputRef={inputRef}
          onKeyDown={handleEnterSend}
          onChange={(e) => setQuestion(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <Button
          variant="contained"
          size="large"
          disableElevation
          className={clsx(
            'shrink-0 !text-lg !rounded-md !px-4 !pr-3 self-end !text-white'
          )}
          startIcon={
            isLoading ? (
              <AiOutlineLoading size={18} className="animate-spin" />
            ) : (
              <FaPaperPlane size={18} />
            )
          }
          disabled={isLoading}
          onClick={onSend}
        >
          {isLoading ? t('chat.asking') : t('chat.ask')}
        </Button>
      </div>
    </div>
  )
}

export default MessageInput
