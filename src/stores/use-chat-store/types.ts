import type {
  ChatInteractiveParams,
  ChatParams,
  ChatResponseAnswerMeta,
} from './../../api/chat/types'
import type { ChatResponseAnswer } from '@/api/chat/types'

export enum DataType {
  NewsInfo = 'news_info',
  AnnouncementInfo = 'announcement_info',
  TwitterInfo = 'twitter_info',
  TradeInfo = 'trade_info',
}

export interface Message {
  msg: string
  msgs?: ChatResponseAnswerMeta
  position?: 'left' | 'right'
  className?: string
  isLoadingMsg?: boolean
  isInteractive?: boolean
  isIntention?: boolean
  rawData?: ChatResponseAnswer
  msgId?: string
  type?: string
  data_type?: DataType
}

export interface InteractiveMessageOptions {
  question: string
  id?: number
  type?: number
  name?: string
  selected_entities?: ChatInteractiveParams[]
}

export interface States {
  intention: string
  question: string
  messages: Message[]
  chatEl: HTMLElement | null
  isLoading: boolean
  // controller: AbortController | null
  // isReceiving: boolean
  // thinkTimer: NodeJS.Timeout | undefined
}

export interface Actions {
  setIntention(intention: string): void
  setQuestion(value: string): void
  setMessage(msg: Message[]): void
  // setThinkTimer(value: NodeJS.Timeout): void
  // setController(value: AbortController): void
  // setIsReceiving(value: boolean): void
  // addMessage(message: Message | Message[]): void
  // addMessageAndLoading(message: Message): void
  // removeLoadingMessage(): void
  // removeAllMessage(): void
  setChatEl(el: HTMLElement): void
  // addStreamMessage(content: string, ops?: Omit<Message, 'msg'>): void
  // getParams(opts?: InteractiveMessageOptions): ChatParams
  setIsLoading(bool: boolean): void
  // resetSomeState(): void
  // handleNormalMessage(data: ChatResponseAnswer): void
  // cancelAnswer(text: string): void
  // findPrevInteractive(id: string | undefined): Message | undefined
}
