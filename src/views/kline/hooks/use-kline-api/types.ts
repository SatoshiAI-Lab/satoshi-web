export type SymbolStr = `${string}-${string}`

// dex:<chain>:<address>:<pool>:<interval>
export type DexTag = `dex:${string}:${string}:${string}:${string}`

// cex:<exchange>:<symbol-quote>:<interval>
export type CexTag = `cex:${string}:${SymbolStr}:${string}`

export type TagString = DexTag | CexTag

export type WithPromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void

export type Handler<T> = (data: T) => void

export interface KLineEmitEvents {
  listen: ListenSend
  unlisten: ListenSend // unlisten is also listen params.
  history: HistorySend
}

export interface KLineOnEvents {
  pong: ReceiveBase<string>
  init: ReceiveBase<ReceivedBar[]>
  notice: ReceiveBase<never>
  update: ReceiveBase<ReceivedBar[]>
  history: ReceiveBase<ReceivedBar[]>
  error: ReceiveBase<never>
}

export interface ChartTokenParams {
  source: string
  symbol: SymbolStr
  interval: string
}

export interface CexParams {
  type: 'cex'
  exchange: string
  symbol: SymbolStr
  interval: string
}

export interface DexParams {
  type: 'dex'
  chain: string
  address: string
  pool: string
  interval: string
}

export interface ListenSend {
  tag?: TagString
  exchange?: string
  symbol?: SymbolStr
  interval?: string
  chain?: string
  address?: string
  pool?: string
}

export interface HistorySend extends ListenSend {
  tag: TagString
  start: number
  limit: number
}

export interface ReceiveBase<T = unknown, M = string> {
  type: string
  tag?: TagString
  status?: 'error' | 'success'
  message?: M
  data?: T
}

export interface KLineBarBase {
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface ReceivedBar extends KLineBarBase {
  timestamp: number
  turnover?: number
}
