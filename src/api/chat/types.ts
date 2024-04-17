import { WalletChain, WalletPlatform } from '@/config/wallet'

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
    Partial<ChatResponseMetaBalance>,
    Partial<ChatResponseTxConfrim> {
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
  value: string
  address: string
  token: number
  tokens: ChatResponseWalletListToken
}

export interface ChatResponseTxConfrim {
  from_token_info: TokenInfo[]
  amount: number
  from_token_name: string
  to_token_name: string
  to_token_info: TokenInfo[]
}

export interface TokenInfo {
  platform: string
  chain: WalletChain
  token_name: null | string
  contract: string
  platform_id: number
  chain_logo: string
  chain_symbol: string
  token_logo: null | string
}

export interface ChatResponseTokneName {
  address: string
  logo: string
  name: string
  symbol: string
  description: string
  price: string
  liquidity: string
  market_cap: null
  volume: string
  twitter?: string
  telegram?: string
  websites: string[]
  price_change: string
  holders: number
}

export interface ChatResponseWalletListRaw {
  status: number
  data: ChatResponseWalletList[]
  chain: string
}

export interface ChatResponseWalletBalance {
  address: string
  tokens: ChatResponseWalletListToken[]
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
  address: string
  amount: number
  chain_id: number
  chain_logo: string
  chain_name: string
  decimals: number
  logoUrl: string
  name: string
  priceUsd: number
  symbol: string
  valueUsd: number
}

export interface ChatResponseTokenDetail {
  address: string
  description: string
  holders: number
  liquidity: string
  logo: string
  market_cap: string
  name: string
  price: string
  price_change: string
  symbol: string
  telegram: string
  twitter: string
  volume: string
  websites: string[]
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
  content: I18
  created_at: string
  data_type: string
  id: number
  logo: string
  title: I18
  source: string
}

export interface I18 {
  en: string
  zh: string
  [key: string]: string
}
export interface ChatResponseMetaAnnounceMent {
  content: I18
  created_at: string
  data_type: string
  id: number
  seo: I18
  source_logo: string
  source_id: number
  source_name: string
  title: I18
  url: I18
}

export interface ChatResponseMetaTwitter {
  id: number
  content: I18
  created_at: string
  twitter_id: string
  name: string
  tweets_id: string
  twitter: string
  url: []
  photo: []
  twitter_logo: string
  data_type: string
}

export interface ChatResponseMetaWallet {
  id: number
  sender: string
  currency_symbol: string
  currency_amount: number
  side_symbol: string
  side_amount: number
  type: string
  created_at: string
  name: string
  remark: string
  content: string
  data_type: string
  hash: string
}

export interface ChatResponseMetaNewPool {
  id: string
  chain: string
  address: string
  name: string
  symbol: string
  liquidity: number
  price: number
  started: string
  twitter: string
  telegram: string
  website: string
  security: {
    [key: string]: string
  }
  top_holders: {
    [key: string]: string
  }
  score: {
    score: string
    detail: []
  }
  created_at: string
  data_type: string
}
export interface ChatResponseMetaNewPoolV2 {
  id: string
  chain: string
  address: string
  name: string
  symbol: string
  liquidity: number
  price: number
  started: string
  twitter: string
  telegram: string
  website: string
  security: Security
  top_holders: TopHolders
  score: Score
  created_at: string
  data_type: string
  outside_url: string
}

export interface Score {
  score: number
  detail: string[]
}

export interface Security {
  content: SecurityContent[]
  remark: Remark
}

export interface SecurityContent {
  status: number
  content: Remark
  type: string
}

export interface Remark {
  en: string
  zh: string
}

export interface TopHolders {
  [x: string]: string
}

export interface SpeechResponse {
  data: { text: string }
  message: string
  status: number
}
