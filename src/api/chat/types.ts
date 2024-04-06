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
    Partial<ChatResponseWalletListRaw> {
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

export interface ChatResponseWalletListRaw {
  status: number
  data: ChatResponseWalletList[]
}

export interface ChatResponseWalletList {
  id: string // 钱包id
  name: string // 钱包名
  address: string // 钱包地址
  platform: string // 平台: SOL/EVM
  added_at: string // 添加时间
  user: string // 用户id
  value: string // 总价值
  tokens: ChatResponseWalletListToken[]
}

export interface ChatResponseWalletListToken {
  symbol: string // 代币简称
  name: string // 代币名
  mintAddress: string // 铸造者
  amount: string // 持有量
  priceUsd: string // 代币价格
  valueUsd: string // 价值
  logoUrl: string // 头像
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
