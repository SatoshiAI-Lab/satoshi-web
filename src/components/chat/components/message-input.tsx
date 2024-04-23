import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPaperPlane } from 'react-icons/fa'
import { AiOutlineLoading } from 'react-icons/ai'
import { Button, IconButton, TextareaAutosize } from '@mui/material'
import { useKey } from 'react-use'
import { clsx } from 'clsx'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import { MdMic } from 'react-icons/md'

import InputMenu from './input-menu'
import { useChatStore } from '@/stores/use-chat-store'
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard'
import { utilDom } from '@/utils/dom'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import { chatApi } from '@/api/chat'
import { useHistory } from '@/hooks/use-history'
import { useScroll } from '@/hooks/use-scroll'
import { InputButtons } from './input-buttons'

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
  const throttledHandleInputKeyup = useThrottledCallback(handleInputKeyup, 3000)
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder()
  const [recording, setRecording] = useState(false)
  const { addHistory } = useHistory({
    inputRef: inputRef,
    onChange: setQuestion,
  })
  const { isTrigger, scrollToBottom } = useScroll({ el: chatEl })

  const record = () => {
    if (recording) {
      stopRecording()
      setRecording(false)
    } else {
      startRecording()
      setRecording(true)
    }
  }

  const send = () => {
    addHistory(question)
    onSend()
  }

  const handleEnterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') return
    if (e.key !== 'Enter') return

    e.preventDefault()
    if (isLoading) return
    // Although is deprecated, but very useful.
    if (e.keyCode === 13) send()
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
  // useInputHistory(inputRef, setQuestion)

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
        'transition-all'
      )}
    >
      <InputMenu />
      <InputButtons
        className="!absolute right-0 -top-4"
        isShow={isTrigger || isLoading}
        showToBottom={isTrigger}
        showPasuse={isLoading}
        onToBottomClick={scrollToBottom}
        onPasuseClick={onCancel}
      />
      <div
        className={clsx(
          'flex rounded-md gap-2 border-2 border-solid items-center duration-500',
          'bg-slate-100 transition-all py-1 px-1 pl-2 hover:border-primary',
          isFocus ? 'border-primary' : 'border-transparent'
        )}
      >
        <TextareaAutosize
          className={clsx(
            'bg-transparent pl-1 text-lg transition-all text-black w-full',
            'resize-none placeholder:whitespace-nowrap placeholder:truncate',
            'outline-none break-all'
          )}
          value={question}
          placeholder={t('chat.placeholder')}
          minRows={1}
          maxRows={5}
          ref={inputRef}
          onKeyDown={handleEnterSend}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyUp={throttledHandleInputKeyup}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <IconButton
          className={clsx('rounded-full p-1 w-[40px] h-[40px]')}
          onClick={record}
        >
          {recording ? (
            <img src="/svg/three-dots.svg" width={22} height={22}></img>
          ) : (
            <MdMic size={22} />
          )}
        </IconButton>
        <Button
          variant="contained"
          size="large"
          disableElevation
          className={clsx(
            'shrink-0 !text-lg !rounded-md !px-4 !pr-3 self-end',
            '!text-white'
          )}
          startIcon={
            isLoading ? (
              <AiOutlineLoading size={18} className="animate-spin" />
            ) : (
              <FaPaperPlane size={18} />
            )
          }
          disabled={isLoading}
          onClick={send}
        >
          {isLoading ? t('chat.asking') : t('chat.ask')}
        </Button>
      </div>
    </div>
  )
}

export default MessageInput
