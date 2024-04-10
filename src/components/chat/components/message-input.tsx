import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPaperPlane } from 'react-icons/fa'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button, IconButton, TextareaAutosize } from '@mui/material'
import { useKey } from 'react-use'
import clsx from 'clsx'
import { FaRegCirclePause } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { MdMic } from 'react-icons/md'

import InputMenu from './input-menu'
import { useChatStore } from '@/stores/use-chat-store'
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard'
import { utilDom } from '@/utils/dom'
import { useInputHistory } from '@/hooks/use-input-history'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import { chatApi } from '@/api/chat'

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
  // Why dynamic maxRows? Adaptation placeholder to long.
  const [maxRows, setMaxRows] = useState(1)
  const throttledHandleInputKeyup = useThrottledCallback(handleInputKeyup, 3000)
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder()
  const [recording, setRecording] = useState(false)

  const record = () => {
    if (recording) {
      stopRecording()
      setRecording(false)
    } else {
      startRecording()
      setRecording(true)
    }
  }

  const handleEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      if (maxRows < 5) setMaxRows(5)
      return
    }
    if (e.key !== 'Enter') return

    e.preventDefault()

    if (isLoading) return
    // Although is deprecated, but very useful.
    if (e.keyCode === 13) {
      onSend()
      return
    }
  }

  function handleInputKeyup() {
    setInputKeyup(true)
    setTimeout(() => {
      setInputKeyup(false)
    }, 10000)
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

  useEffect(() => {
    if (!question) setMaxRows(1)
  }, [question])

  // mobile virtual keyboard adapation.
  useEffect(() => {
    if (!chatEl || !keyboardIsShow) return

    utilDom.scrollToBottom(chatEl)
  }, [keyboardIsShow, chatEl])

  useEffect(() => {
    if (!recordingBlob) return
    const reader = new FileReader()
    reader.readAsDataURL(recordingBlob)
    reader.onloadend = async () => {
      const base64data = reader.result as string
      const base64WithoutPrefix = base64data.split(',')[1]
      const {
        data: { text },
      } = await chatApi.getVoidText(base64WithoutPrefix)
      setQuestion(text)
    }
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob])

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
        <TextareaAutosize
          className={clsx(
            'bg-transparent pl-1 text-lg transition-all text-black w-full outline-none',
            'resize-none placeholder:whitespace-nowrap placeholder:truncate'
          )}
          value={question}
          placeholder={t('chat.placeholder')}
          minRows={1}
          maxRows={maxRows}
          ref={inputRef}
          onKeyDown={handleEnterSend}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyUp={throttledHandleInputKeyup}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <button
          className={clsx(
            recording
              ? 'animate-bounce animate-ease-linear animate-infinite'
              : '',
            'rounded-full p-1'
          )}
          onClick={record}
        >
          <MdMic size={22} />
        </button>
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
