import { useWebSocket } from '@/hooks/use-websocket'

import type {
  WithPromiseExecutor,
  KLineOnEvents,
  KLineEmitEvents,
  ListenTokenSend,
  HistorySend,
  Handler,
} from './types'

/**
 * All kline APIs, Wrap WebSocket to sync APIs.
 * You don't need to connect manually.
 * When you call any method, it will automatically connect to WebSocket.
 */
export const useKLineApi = () => {
  const listenParams: ListenTokenSend[] = []
  const ws = useWebSocket<KLineOnEvents, KLineEmitEvents>({
    heartbeat: JSON.stringify({ type: 'ping' }),
  })

  // Waiting for WebSocket connection,
  // If is connected, won't repeat connect.
  const waitingForConnect = async () => {
    if (ws.getInstance()?.readyState === WebSocket.OPEN) return

    await ws.connect(process.env.NEXT_PUBLIC_KLINE_API!)
  }

  // Unified wrap API, waiting for connect, convert to sync API, handle error.
  const withPromise = async <T = unknown>(executor: WithPromiseExecutor<T>) => {
    await waitingForConnect()

    return new Promise<T>((resolve, reject) => {
      ws.on('error', reject)
      executor(resolve, reject)
    })
  }

  // Get a token supported exchagne source.
  const getTokenSources = async (token: string) => {
    return withPromise<KLineOnEvents['source']>((resolve) => {
      ws.emit('source', { token })
      ws.on('source', resolve)
    })
  }

  // If need to listen a new token,
  // it's necessary to clear last listen token.
  const clearLastListen = async () => {
    const isEmpty = listenParams.length === 0
    if (isEmpty) return

    const params = listenParams.pop()
    if (!params) return

    return unlistenToken(params)
  }

  // Listen a toekn.
  const listenToken = async (params: ListenTokenSend) => {
    await clearLastListen()
    return withPromise<KLineOnEvents['init']>((resolve) => {
      listenParams.push(params) // push to array, Convenient for unlisten.
      ws.emit('listen', params)
      ws.on('init', resolve)
    })
  }

  // Unlisten a token.
  const unlistenToken = (params: ListenTokenSend) => {
    return withPromise<KLineOnEvents['ok']>((resolve) => {
      ws.emit('unlisten', params)
      ws.on('ok', resolve)
    })
  }

  // Unlisten all listened tokens.
  const unlistenAllToken = async () => {
    try {
      const unlistens = await Promise.all(
        listenParams.map((listen) => unlistenToken(listen))
      )
      // Attention clear listens array.
      listenParams.splice(0, listenParams.length)
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

  return {
    getTokenSources,
    listenToken,
    unlistenToken,
    unlistenAllToken,
    getHistory,
    onUpdateBar,
    onErrorMessage,
  }
}
