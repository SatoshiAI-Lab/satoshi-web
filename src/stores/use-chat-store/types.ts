import path from 'path'
import type {
  ChatInteractiveParams,
  ChatResponseMeta,
  ChatResponseMetaNewPoolV2,
} from './../../api/chat/types'
import type { ChatResponse } from '@/api/chat/types'

export enum DataType {
  NewsInfo = 'news_info',
  AnnouncementInfo = 'announcement_info',
  TwitterInfo = 'twitter_info',
  TradeInfo = 'trade_info',
  PoolInfo = 'pool_info',
}

// export interface Message {
//   msg: string
//   msgs?: ChatResponseMeta
//   position?: 'left' | 'right'
//   className?: string
//   isLoadingMsg?: boolean
//   isInteractive?: boolean
//   isMonitor?: boolean
//   isIntention?: boolean
//   rawData?: ChatResponse
//   msgId?: string
//   type?: string
//   data_type?: DataType
// }

export type MessageRole = 'user' | 'assistant' | 'system'

export type PartialMessage = Partial<Omit<ChatResponse, 'text'>>

export type RequiredMessage = Pick<ChatResponse, 'text'>

export interface Message
  extends PartialMessage,
    RequiredMessage,
    Partial<ChatResponseMetaNewPoolV2> {
  id: string
  role?: MessageRole
  isLoading?: boolean
  data_type?: DataType

  isInteractive?: boolean
  isIntention?: boolean
  isReference?: boolean
  isMonitor?: boolean
}

export interface States {
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
}

export interface Actions {
  setIntention(intention: string): void
  setQuestion(value: string): void
  /** Use `getMessages` to get latest messages. */
  getMessages(): Message[]
  setMessages(msg: Message[] | ((msgs: Message[]) => Message[])): void
  setUnreadMessage(unreadMessages: Message[]): void
  setChatEl(el: HTMLElement): void
  setIsLoading(bool: boolean): void
  setInputKeyup(bool: boolean): void
  setWaitAnswer(bool: boolean): void
  setReadAnswer(bool: boolean): void
  setSocket(socket: WebSocket): void
}
