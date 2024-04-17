import { useRef } from 'react'

import type { VoidFn } from '@/types/types'

type OnRead = (data: string, isDone: boolean) => void

export const useEventStream = () => {
  const streamRef = useRef<ReadableStream<Uint8Array>>()
  const readerRef = useRef<ReadableStreamDefaultReader<string>>()

  // Q: Why recursion instead of a loop?
  // A: because loop will split the large data response,
  // causing JSON.parse error.
  const recursionRead = async (
    reader: ReadableStreamDefaultReader<string>,
    onRead: OnRead,
    onDone?: VoidFn
  ) => {
    const { done, value } = await reader.read()

    if (done) {
      onDone?.()
      return
    }

    onRead(value, done)
    recursionRead(reader, onRead, onDone)
  }

  const parseStream = async (
    stream: ReadableStream<Uint8Array>,
    onRead: OnRead,
    onDone?: VoidFn
  ) => {
    const reader = stream.pipeThrough(new TextDecoderStream()).getReader()

    streamRef.current = stream
    readerRef.current = reader
    recursionRead(reader, onRead, onDone)
  }

  const cancelParseStream = async () => {
    const stream = streamRef.current
    const reader = readerRef.current

    if (!stream || !reader) return

    // reader is reading, so we must cancel & wait for it closed.
    await reader.cancel()
    await reader.closed
    await stream.cancel()
  }

  return {
    parseStream,
    cancelParseStream,
  }
}
