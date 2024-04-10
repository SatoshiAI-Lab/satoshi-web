import { useEmitter, type EmitEvents, type OnEvents } from '@/hooks/use-emitter'

import type { UseWebSocketOptions } from './types'

/**
 * A WebSocket hook, it's not dependent on React.
 * You can pass two generics, `OnEvents` for listening to events sent by the server,
 * and `EmitEvents` for events sent from the client to the server, used for type hints.
 * @param options
 */
export const useWebSocket = <O extends OnEvents, E extends EmitEvents>(
  options?: UseWebSocketOptions
) => {
  const { url, heartbeat, interval = 10 } = options ?? {}
  const emitter = useEmitter<O, E>()
  let ws = url ? new WebSocket(url) : null
  let timer: number

  if (url) initialEvents()

  // Listen WebSocket all events.
  function initialEvents() {
    return new Promise<WebSocket>((resolve, reject) => {
      if (!ws) {
        reject('[useWebSocket Error]: not `ws` instance yet.')
        return
      }

      ws.addEventListener('open', (e) => {
        resolve(ws!)
        onOpen(e)
      })
      ws.addEventListener('error', (e) => {
        reject(e)
        onError(e)
      })
      ws.addEventListener('close', (e) => {
        reject(e)
        onClose(e)
      })
      ws.addEventListener('message', (e) => {
        resolve(e.data)
        onMessage(e)
      })
    })
  }

  // Send heartbeat message, if `heartbeat` is existed.
  const sendHeartbeat = () => {
    if (!heartbeat) return
    if (typeof heartbeat === 'boolean') {
      ws?.send('ping')
    } else if (typeof heartbeat === 'string') {
      ws?.send(heartbeat)
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

  const emitMessage = (name: keyof E, data: Record<string, any>) => {
    const message = JSON.stringify({
      type: name,
      data,
    })

    ws?.send(message)
  }

  const connect = (overrideURL?: string) => {
    ws = new WebSocket(overrideURL ?? url ?? '')
    return initialEvents()
  }

  const disconnect = () => {
    ws?.close()
    clearInterval(timer)
  }

  return {
    getInstance: () => ws,
    connect,
    disconnect,
    on: emitter.on.bind(emitter),
    emit: emitMessage,
  }
}
