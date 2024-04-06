export interface ChatResponse {
  status: number
  message: string
  data: {
    answer: ChatResponseAnswer[]
  }
}

export interface ChatResponseAnswer {
  answer_type: string
  text: string
  hyper_text: string
  meta: ChatResponseAnswerMeta
}

export interface ChatResponseAnswerMeta
  extends Partial<ChatResponseMetaInteractive>,
    Partial<ChatResponseMetaReference>,
    Partial<ChatResponseWalletListRaw>,
    Partial<ChatResponseMetaBalance> {
  emotion?:
    | 'natural'
    | 'happy'
    | 'sad'
    | 'awkward'
    | 'denial'
    | 'angry'
    | 'encouragement'
}

export interface ChatResponseMetaDynamic {
  intro: string
  intro_detail: string
  rank_id: number
}

export interface ChatResponseMetaBalance {
  address: string
  token: number
  tokens: {
    symbol: string
    name: string
    mintAddress: string
    amount: string
    priceUsd: string
    valueUsd: string
    logoUrl: string
  }
}

export interface ChatResponseWalletListRaw {
  status: number
  data: ChatResponseWalletList[]
}

export interface ChatResponseWalletList {
  id: string
  name: string
  address: string
  platform: string
  added_at: string
  user: string
  value: string
  tokens: ChatResponseWalletListToken[]
}

export interface ChatResponseWalletListToken {
  symbol: string
  name: string
  mintAddress: string
  amount: string
  priceUsd: string
  valueUsd: string
  logoUrl: string
}

export interface ChatResponseMetaLabel {
  id: number
  name: string
  alias: string[]
  type: number
  key: string
  dynamic: ChatResponseMetaDynamic
}

export interface ChatResponseMetaInteractive {
  NFT: []
  coin: ChatResponseAnswerMetaCoin[]
  exchange: []
  label: ChatResponseMetaLabel[]
  role: []
  software: []
}

export interface ChatResponseMetaReference {
  type: string
  content: string
  published_at: string
  url: string
}

export interface ChatResponseAnswerMetaCoin {
  id: number
  name: string
  alias: string[]
  type: number
  key: string
  dynamic: ChatResponseMetaDynamic
}

export interface ChatInteractiveParams {
  id?: number
  type?: number
}

export interface ChatParams extends ChatInteractiveParams {
  question: string
  user_info: ChatParamsUserInfo
  history: ChatParamsHistory[]
  stream?: boolean
  selected_entities?: ChatInteractiveParams[]
  intent_stream?: string
}

export interface ChatParamsUserInfo {
  username: string
  is_vip: boolean
  preference: { language: string }
  favorite: {}
}

export interface ChatParamsHistory {
  role: string
  content: string
}

export interface ChatTransactionParams {
  is_confirm: number // confirm：1  cancel：0
  user_token: string // user id
  // Below parameters is backend returned
  from_token_contract: string // token contract address
  from_token_name: string // token name
  from_amount: number // transaction amount
  to_token_contract: string // target token contract address
  to_token_name: string // target token name
}

export interface ChatMointorRoomRes {
  id: string
  members: string[]
  created_at: Date
  messages: any[]
}

export interface ChatResponseMetaNewsInfo {
  content: string
  created_at: string
  data_type: string
  id: number
  logo: string
  title: string
}
