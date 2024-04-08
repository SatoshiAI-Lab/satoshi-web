import type { Pair } from '@/types/types'

export type SymbolStr = `${string}-${string}`

export type WithPromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void

export type Handler<T> = (data: T) => void

export interface KLineEmitEvents {
  source: { token: string }
  listen: ListenTokenSend
  unlisten: ListenTokenSend // unlisten is also listen params.
  history: HistorySend
}

export interface KLineOnEvents {
  pong: ReceiveBase<string>
  source: ReceiveBase<Pair[]>
  init: ReceiveBase<ReceivedBar[]>
  ok: ReceiveBase<never>
  update: ReceiveBase<ReceivedBar[]>
  history: ReceiveBase<ReceivedBar[]>
  error: ReceiveBase<never>
}

export interface ListenTokenSend {
  symbol: SymbolStr
  source: string
  interval: string
}

export interface HistorySend {
  symbol: SymbolStr
  start: number
  end: number
}

export interface ReceiveBase<T = unknown, E = string, M = string> {
  type: string
  data?: T
  error?: E
  msg?: M
}

export interface KLineBarBase {
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface ReceivedBar extends KLineBarBase {
  turnover: number
  _ts: number
  base: string
  quote: string
  source: string
}
