import type { ChatResponse, MonitorData } from '@/api/chat/types'
import type { PartialPick } from '@/types/types'

export enum DataType {
  NewsInfo = 'news_info',
  AnnInfo = 'announcement_info',
  TwitterInfo = 'twitter_info',
  TradeInfo = 'trade_info',
  PoolInfo = 'pool_info',
}

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message extends Partial<ChatResponse> {
  // Required props.
  id: string
  text: string
  role: MessageRole

  // Frontend custom type add here.
  isLoading?: boolean
  isSystem?: boolean
  isDefaultMessage?: boolean

  // Used for monitor message.
  data_type?: DataType
}

export interface ChatStore {
  question: string
  messages: Message[]
  chatEl: HTMLElement | null
  chatInputEl: HTMLInputElement | HTMLTextAreaElement | null
  isLoading: boolean
  unreadMessages: MonitorData[]
  inputKeyup: boolean
  readAnswer: boolean
  waitAnswer: boolean
  socket: WebSocket | undefined

  setQuestion(value: string): void
  getMessages(): Message[]
  setMessages(msg: Message[] | ((msgs: Message[]) => Message[])): void

  addMessage(message: PartialPick<Message, 'id'>): Message
  removeMessage(id: string): Message[]
  updateMessage(id: string, updater: (m: Message) => Message): Message[]
  getMessage(id: string): [Message, number]
  findPrevMessage(id: string): Message | undefined

  setUnreadMessage(unreadMessages: MonitorData[]): void
  setChatEl(el: HTMLElement): void
  setChatInputEl(el: HTMLInputElement | HTMLTextAreaElement): void
  setIsLoading(bool: boolean): void
  setInputKeyup(bool: boolean): void
  setWaitAnswer(bool: boolean): void
  setReadAnswer(bool: boolean): void
  setSocket(socket: WebSocket): void

  scrollToChatBottom(): void
}
