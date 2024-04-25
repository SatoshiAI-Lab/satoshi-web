import type {
  ChatParams,
  ChatResponseMetaNewPoolV2,
} from './../../api/chat/types'
import type { ChatResponse } from '@/api/chat/types'
import type { PartialPick } from '@/types/types'

export enum DataType {
  NewsInfo = 'news_info',
  AnnouncementInfo = 'announcement_info',
  TwitterInfo = 'twitter_info',
  TradeInfo = 'trade_info',
  PoolInfo = 'pool_info',
}

export type MessageRole = 'user' | 'assistant' | 'system'

export type ChatParial = Partial<Omit<ChatResponse, 'text'>>

export type ChatRequired = Pick<ChatResponse, 'text'>

export type ChatNewPool = Partial<ChatResponseMetaNewPoolV2>

// When role is not 'user', maybe have 'userParams'
export interface ChatUserParams {
  userParams?: ChatParams
}

export interface Message
  extends ChatParial,
    ChatRequired,
    ChatNewPool,
    ChatUserParams {
  id: string
  role?: MessageRole
  isLoading?: boolean
  data_type?: DataType

  // Here is `answer_type` alias props.
  isInteractive?: boolean
  isIntention?: boolean
  isReference?: boolean
  isMonitor?: boolean
  isPrivateKey?: boolean
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
