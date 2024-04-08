import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPaperPlane } from 'react-icons/fa'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button, IconButton, InputBase } from '@mui/material'
import { useKey } from 'react-use'
import clsx from 'clsx'
import { FaRegCirclePause } from 'react-icons/fa6'
import { motion } from 'framer-motion'

import InputMenu from './input-menu'
import { useChatStore } from '@/stores/use-chat-store'
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard'
import { utilDom } from '@/utils/dom'
import { useInputHistory } from '@/hooks/use-input-history'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'

interface MessageInputProps {
  autofocus?: boolean
  onSend: () => void
  onCancel?: () => void
}

function MessageInput(props: MessageInputProps) {
  const { autofocus = true, onSend, onCancel } = props
  const { t } = useTranslation()
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const keyboardIsShow = useMobileKeyboard()
  const { question, chatEl, isLoading, setQuestion, setInputKeyup } =
    useChatStore()

  const handleEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') return
    if (e.key !== 'Enter') return

    e.preventDefault()

    if (isLoading) return
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

  // mobile virtual keyboard adapation.
  useEffect(() => {
    if (!chatEl || !keyboardIsShow) return

    utilDom.scrollToBottom(chatEl)
  }, [keyboardIsShow, chatEl])

  const handleInputKeyup = () => {
    console.log('user start keyup now')
    console.log(
      `keyup: ${useChatStore.getState().inputKeyup}`,
      `read answer: ${useChatStore.getState().readAnswer}`,
      `wait answer: ${useChatStore.getState().waitAnswer}`
    )

    setInputKeyup(true)
    setTimeout(() => {
      console.log('user stop keyup now')
      console.log(
        `keyup: ${useChatStore.getState().inputKeyup}`,
        `read answer: ${useChatStore.getState().readAnswer}`,
        `wait answer: ${useChatStore.getState().waitAnswer}`
      )
      setInputKeyup(false)
    }, 10000)
  }

  const onCancelAnswer = () => {}

  const throttledHandleInputKeyup = useThrottledCallback(handleInputKeyup, 3000)

  return (
    <div
      className={clsx(
        'sticky bottom-4 z-20 max-sm:mx-5 mr-10 max-sm:bottom-0',
        'transition-all '
      )}
    >
      <InputMenu />
      <div
        className={clsx(
          'flex rounded-md gap-2 border-2 border-solid items-center duration-500',
          'bg-slate-100 transition-all py-1 px-1 pl-2 hover:border-primary',
          isFocus ? 'border-primary' : 'border-transparent',
          'relative'
        )}
      >
        <motion.div
          className={clsx('!absolute right-0 -top-14')}
          animate={{
            opacity: isLoading ? 1 : 0,
            y: isLoading ? 0 : 56,
          }}
        >
          <IconButton onClick={onCancel} className="!bg-slate-50">
            <FaRegCirclePause size={28} className="text-red-500" />
          </IconButton>
        </motion.div>
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
          onKeyUp={throttledHandleInputKeyup}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        {/* <MicRecord startRecording={() => {}} stopRecording={() => {}} /> */}
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
