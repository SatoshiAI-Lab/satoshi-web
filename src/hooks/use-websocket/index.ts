import { useEmitter, type EmitEvents, type OnEvents } from '@/hooks/use-emitter'

import type { UseWebSocketOptions } from './types'
import { useRef } from 'react'

/**
 * A WebSocket hook, it's not dependent on React.
 * Use two generics to define the `on` & `emit` events & received data type.
 * @param options
 *
 * @example
 * ```tsx
 * const ws = useWebSocket({
 *   // If set url, will be immediate connection.
 *   url: 'wss://example.com',
 *   heartbeat: JSON.stringify({ type: 'ping' }),
 * })
 *
 * // If you have not want to immediate connection,
 * // don't set url & use `ws.connect`. like:
 * await ws.current?.connect('wss://example.com')
 * ws.on('event', (data) => {})
 * ws.emit('event', data)
 * ```
 */
export const useWebSocket = <O extends OnEvents, E extends EmitEvents>(
  options?: UseWebSocketOptions
) => {
  const { url, heartbeat, interval = 10 } = options ?? {}
  const emitter = useEmitter<O, E>()
  let ws = useRef(url ? new WebSocket(url) : null)
  let timer: number

  if (url) initialEvents()

  // Listen WebSocket all events.
  function initialEvents() {
    return new Promise<WebSocket>((resolve, reject) => {
      if (!ws) {
        reject('[useWebSocket Error]: not `ws` instance yet.')
        return
      }

      ws.current?.addEventListener('open', (e) => {
        resolve(ws.current!)
        onOpen(e)
      })
      ws.current?.addEventListener('error', (e) => {
        reject(e)
        onError(e)
      })
      ws.current?.addEventListener('close', (e) => {
        reject(e)
        onClose(e)
      })
      ws.current?.addEventListener('message', (e) => {
        resolve(e.data)
        onMessage(e)
      })
    })
  }

  // Send heartbeat message, if `heartbeat` is existed.
  const sendHeartbeat = () => {
    if (!heartbeat) return
    if (typeof heartbeat === 'boolean') {
      ws.current?.send('ping')
    } else if (typeof heartbeat === 'string') {
      ws.current?.send(heartbeat)
    }
  }

  // Keep heartbeat, if `interval` is existed.
  const keepHeartbeat = () => {
    // We can use `!interval`,
    // because not allowed the interval is zero.
    if (!interval) return
    timer = window.setInterval(sendHeartbeat, interval * 1000)
  }

  const onOpen = (e: Event) => {
    sendHeartbeat()
    keepHeartbeat()
    options?.onOpen?.(e)
  }

  const onMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data || 'null')

    options?.onMessage?.(event)
    emitter.emit(message.type, message)
  }

  const onClose = (e: CloseEvent) => {
    options?.onClose?.(e)
    window.clearInterval(timer)
  }

  const onError = (e: Event) => {
    options?.onError?.(e)
  }

  const emitMessage = (name: keyof E, data: Record<string, any> | string) => {
    const message = JSON.stringify({
      type: name,
      data,
    })

    ws.current?.send(message)
  }

  const connect = (overrideURL?: string) => {
    ws.current = new WebSocket(overrideURL ?? url ?? '')
    return initialEvents()
  }

  const disconnect = () => {
    ws.current?.close()
    clearInterval(timer)
  }

  return {
    getInstance: () => ws.current,
    connect,
    disconnect,
    on: emitter.on.bind(emitter),
    emit: emitMessage,
  }
}
