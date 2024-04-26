import type { ChatResponse } from '@/api/chat/types'
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

  // Used for loading message.
  isLoading?: boolean

  // Used for monitor message.
  data_type?: DataType

  // Categorilize for `answer_type` props.
  isInteractive?: boolean
  isReference?: boolean
  isIntent?: boolean
  isMonitor?: boolean
  isPrivateKey?: boolean
}

export interface ChatStore {
  intention: string
  question: string
  messages: Message[]
  chatEl: HTMLElement | null
  isLoading: boolean
  unreadMessages: Message[]
  inputKeyup: boolean
  readAnswer: boolean
  waitAnswer: boolean
  socket: WebSocket | undefined

  setIntention(intention: string): void
  setQuestion(value: string): void
  getMessages(): Message[]
  setMessages(msg: Message[] | ((msgs: Message[]) => Message[])): void

  addMessage(message: PartialPick<Message, 'id'>): void
  removeMessage(id: string): void
  updateMessage(id: string, message: PartialPick<Message, 'id' | 'text'>): void
  getMessage(id: string): void

  setUnreadMessage(unreadMessages: Message[]): void
  setChatEl(el: HTMLElement): void
  setIsLoading(bool: boolean): void
  setInputKeyup(bool: boolean): void
  setWaitAnswer(bool: boolean): void
  setReadAnswer(bool: boolean): void
  setSocket(socket: WebSocket): void
}
