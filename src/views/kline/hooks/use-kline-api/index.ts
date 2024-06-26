import { useWebSocket } from '@/hooks/use-websocket'

import type {
  WithPromiseExecutor,
  KLineOnEvents,
  KLineEmitEvents,
  ListenSend,
  HistorySend,
  Handler,
  TagString,
} from './types'

/**
 * All kline APIs, Wrap WebSocket to sync APIs.
 * You don't need to connect manually.
 * When you call any method, it will automatically connect to WebSocket.
 */
export const useKLineApi = () => {
  const listenTags: TagString[] = []
  const ws = useWebSocket<KLineOnEvents, KLineEmitEvents>({
    heartbeat: JSON.stringify({ type: 'ping' }),
  })

  // Waiting for WebSocket connection,
  // If is connected, won't repeat connect.
  const waitingForConnect = async () => {
    if (ws.getInstance()?.readyState === WebSocket.OPEN) return

    await ws.connect(process.env.NEXT_PUBLIC_CANDLE_API)
  }

  // Unified wrap API, waiting for connect, convert to sync API, handle error.
  const withPromise = async <T = unknown>(executor: WithPromiseExecutor<T>) => {
    await waitingForConnect()

    return new Promise<T>((resolve, reject) => {
      ws.on('error', reject)
      executor(resolve, reject)
    })
  }

  // If need to listen a new token,
  // it's necessary to clear last listen token.
  const unlistenLastOne = async () => {
    const isEmpty = listenTags.length === 0
    if (isEmpty) return

    const tag = listenTags.pop()
    if (!tag) return

    return unlistenToken({ tag })
  }

  // Listen a toekn.
  const listenToken = async (params: ListenSend) => {
    await unlistenLastOne()
    return withPromise<KLineOnEvents['init']>((resolve) => {
      ws.emit('listen', params)
      ws.on('init', (data) => {
        listenTags.push(data.tag!) // push to array, Convenient for unlisten.
        resolve(data)
      })
    })
  }

  // Unlisten a token.
  const unlistenToken = (params: ListenSend) => {
    return withPromise<KLineOnEvents['notice']>((resolve) => {
      ws.emit('unlisten', params)
      ws.on('notice', resolve)
    })
  }

  // Unlisten all listened tokens.
  const unlistenAllToken = async () => {
    try {
      const unlistens = await Promise.all(
        listenTags.map((tag) => unlistenToken({ tag }))
      )
      // Attention clear listens array.
      listenTags.splice(0, listenTags.length)
      return unlistens
    } catch (error) {
      return error
    }
  }

  // Get a token history bar data.
  const getHistory = (params: HistorySend) => {
    return withPromise<KLineOnEvents['history']>((resolve) => {
      ws.emit('history', params)
      ws.on('history', resolve)
    })
  }

  // Listen KLine bar update.
  const onUpdateBar = (handler: Handler<KLineOnEvents['update']>) => {
    ws.on('update', handler)
  }

  // Listen WebSocket erorr message.
  const onErrorMessage = (handler: Handler<KLineOnEvents['error']>) => {
    ws.on('error', handler)
  }

  const disconnect = () => {
    return ws.disconnect()
  }

  return {
    listenToken,
    unlistenToken,
    unlistenAllToken,
    getHistory,
    onUpdateBar,
    onErrorMessage,
    disconnect,
  }
}
