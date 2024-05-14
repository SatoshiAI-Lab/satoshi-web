import { Chain, Platform } from '@/config/wallet'
import { DataType } from '@/stores/use-chat-store/types'

export interface ChatResponseBase {
  status: number
  message: string
  data: {
    answer: ChatResponse[]
  }
}

export interface ChatResponse {
  answer_type: AnswerType
  text: string
  hyper_text: string
  meta: ChatMeta
}

/***********************  Intent type start. ***********************/

export enum AnswerType {
  // Normal chat.
  TokenBasic = 'token_basic',
  News = 'news',
  RiskAnalysis = 'risk_analysis',
  RiskAnalysisHide = 'risk_analysis_hide',
  Review = 'review',
  DataInsights = 'data_insights',
  TechAnalyze = 'tech_analyze',
  Interactive = 'interactive',
  Reference = 'reference',
  Hide = 'hide',
  End = 'end', // Special type.

  // Stream chat.
  ChatStream = 'chat_stream',
  RiskAnalysisStream = 'risk_analysis_stream',
  NewsStream = 'news_stream',
  DataInsightsStream = 'data_insights_stream',
  TechAnalyzeStream = 'tech_analyze_stream',
  ProcessStream = 'process_stream', // Special type.
  ProcessStreamEnd = 'process_stream_end', // Special type.
  IntentStream = 'intent_stream', // Special type.
  WsMonitor = 'ws_monitor',
}

type ChatMetaParital = ChatMetaInteractive

export interface ChatMeta extends Partial<ChatMetaParital> {
  type: `${MetaType}`
  data: MetaTypeData[MetaType]
  status?: number
  emotion?: Emotion
}

type Emotion =
  | 'Neutral'
  | 'Happy'
  | 'Sad'
  | 'Awkward'
  | 'Negate'
  | 'Angry'
  | 'Encourage'

export enum MetaType {
  Tx = 'transaction',

  WalletCreate = 'wallet_create',
  WalletDelete = 'wallet_delete',
  WalletChange = 'wallet_change',
  WalletCheck = 'wallet_check',
  WalletImport = 'wallet_import',
  WalletExport = 'wallet_export',

  SubNews = 'subscript_news',
  SubTwitter = 'subscript_twitter',
  SubExAnn = 'subscript_announcement',
  SubWallet = 'subscript_wallet',
  SubPool = 'subscript_pool',

  TokenCreate = 'token_create',

  CheckAddr = 'check_address',

  // WebSocket message types, not AI types.
  MonitorNews = DataType.NewsInfo,
  MonitorExAnn = DataType.AnnInfo,
  MonitorWallet = DataType.TradeInfo,
  MonitorTwitter = DataType.TwitterInfo,
  MonitorNewPool = DataType.PoolInfo,

  // custom type, clear history.
  ClearHistory = 'clear_history',
}

export enum MetaTypeCategory {
  // Transaction related.
  TxPrefix = 'transaction',

  // Wallet related.
  WalletPrefix = 'wallet',

  // Subscription related.
  SubPrefix = 'subscript',

  // Token related.
  TokenPrefix = 'token',

  // Check related.
  CheckPrefix = 'check',
}

export type MetaTypeData = {
  [MetaType.Tx]: ChatResponseTxConfrim

  [MetaType.WalletCreate]: {
    platform_name: Platform
  }
  [MetaType.WalletDelete]: {
    wallet_name: string
  }
  [MetaType.WalletChange]: {
    from_wallet_name: string
    to_wallet_name: string
  }
  [MetaType.WalletCheck]: {
    chain_name: Chain
  }
  [MetaType.WalletImport]: {
    private_key: string
    platform_name: Platform
  }
  [MetaType.WalletExport]: {
    wallet_name: string
  }

  [MetaType.SubNews]: SubscriptData
  [MetaType.SubTwitter]: SubscriptData
  [MetaType.SubExAnn]: SubscriptData<number>
  [MetaType.SubWallet]: SubscriptData
  [MetaType.SubPool]: SubscriptData

  [MetaType.TokenCreate]: {
    chain_name: Chain
  }

  [MetaType.CheckAddr]: {
    type: CheckAddrType
    address: string
    chain_name: Chain
  }

  [MetaType.MonitorNews]: ChatResponseMetaNewsInfo
  [MetaType.MonitorExAnn]: ChatResponseMetaAnnounceMent
  [MetaType.MonitorWallet]: ChatResponseMetaWallet
  [MetaType.MonitorTwitter]: ChatResponseMetaTwitter
  [MetaType.MonitorNewPool]: ChatResponseMetaNewPoolV2

  [MetaType.ClearHistory]: {}
}

export type MonitorData =
  | ChatResponseMetaNewsInfo
  | ChatResponseMetaAnnounceMent
  | ChatResponseMetaWallet
  | ChatResponseMetaTwitter
  | ChatResponseMetaNewPoolV2

interface SubscriptData<T = string> {
  type: 'on' | 'off'
  content: T
}

export enum CheckAddrType {
  Account = 'account',
  Token = 'token',
}

/*********************** Intent type end. ***********************/

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
  from_token_info: any
  to_token_name: any
  from_token: {
    type: string
    content: string
    chain_name: string
  }
  to_token: {
    type: string
    content: string
    chain_name: string
  }
  amount: number
}

export interface MultiChainCoin {
  address: string
  chain: ChainInfo
  decimals: number
  is_supported: boolean
  logo: string
  name: string
  price_change: number | null
  price_usd: number
  symbol: string
  holders: number
}
export interface ChainInfo {
  id: string
  logo: string
  name: Chain
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
  chain: Chain
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
  chain_name: any
  address: string
  amount: number
  chain: ChainInfo
  decimals: number
  logo: string
  name: string
  price_usd: number
  price_change_24h: number
  symbol: string
  value_usd: number
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
  platform: Platform
}

export interface ChatResponseMetaLabel {
  id: number
  name: string
  alias: string[]
  type: number
  key: string
  dynamic: ChatResponseMetaDynamic
}

export interface ChatMetaInteractive {
  nft: []
  coin: ChatResponseAnswerMetaCoin[]
  exchange: []
  label: ChatResponseMetaLabel[]
  role: []
  software: []
}

export interface ChatMetaReference {
  id: number | null
  type: string
  content: string
  published_at: string
  title: string
  url: string
  datetime_str: string | null
  sentiment: number
  order_point: number
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
  data_type: DataType
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
  data_type: DataType
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
  data_type: DataType
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
  data_type: DataType
  hash: string
  hash_url: string
  logo: string
  network: string
  token_url: string
  wallet_url: string
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
  data_type: DataType
}
export interface ChatResponseMetaNewPoolV2 {
  id: string
  chain: Chain
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
  data_type: DataType
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
