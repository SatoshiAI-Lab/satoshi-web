import { Chain } from '@/config/wallet'

export interface TokenListParams {
  ids: TokenId[]
  /** default USD */
  currency?: string
}

export interface TokenId {
  id: number
  type: number
}

export interface TokenResponse {
  list: List[]
}

export interface List {
  type: number
  token: ListToken
  label: Label
  event: Event
  index: Index
}

export interface Event {
  id: number
  title: Title
  published_time: string
  is_artificial: number
  estimated_time: string
  estimated_status: number
  route_map_category: RouteMapCategory
  logo: string
}

export interface RouteMapCategory {
  id: number
  name: string
}

export interface Title {
  zh: string
}

export interface Index {
  id: number
  name: string
  logo: string
  intro: string
  percent_change_24_h: number
}

export interface Label {
  id: number
  name: string
  intro: string
  logo: string
  average_change: number
  statistics: Statistics
}

export interface Statistics {
  token_count: number
  rise_count: number
  token: StatisticsToken
}

export interface StatisticsToken {
  id: number
  name: string
  percent_change_24_h: number
}

export interface ListToken {
  id: number
  name: string
  symbol: string
  logo: string
  price: number
  market_cap: number
  percent_change_24_h: number
  other_info: string
  operate: Operate
  token_status: RouteMapCategory
}

export interface Operate {
  id: number
  title: string
  news_type: RouteMapCategory
}

export interface TokenSearchCoin {
  id: number
  name: string
  symbol: string
  logo: string
}

export interface TokenSearchRes {
  coin: TokenSearchCoin[]
}

export interface TokenList {
  list: ListToken[]
}

export interface SelectParams extends Pick<TokenListParams, 'ids'> {
  status: TokenStatus
}

export enum TokenStatus {
  Add = 1,
  Cancel,
  Top,
}

export enum TokenType {
  Token = 1,
  Label,
  Event,
  Indicator,
}

export interface QueryAddrReq {
  address: string
  type?: QueryAddrType
}

export enum QueryAddrType {
  Token = 'token',
  Account = 'account',
}

export interface QueryAddrToken {
  is_supported: boolean
  chain: {
    name: string
    id: string
    logo: string
  }
  logo: string
  address: string
  name: string
  symbol: string
  decimals: number
  price_usd: number
  price_change: number
}

export interface QueryAddrAccount {
  address: string
  value: string
  chain: {
    id: string
    name: string
    logo: string
  }
  tokens: {
    symbol: string
    name: string
    address: string
    decimals: number
    amount: string
    priceUsd: string
    valueUsd: string
    logoUrl: string
  }[]
}

export interface QueryAddrRes {
  tokens: Record<Chain, QueryAddrToken>
  accounts: Record<Chain, QueryAddrAccount>
}

export interface TokenInfoReq {
  chain: Chain
  address: string
}

export interface TokenInfoRes {
  address: string
  logo: string
  name: string
  symbol: string
  description: string
  price: string
  liquidity: string
  market_cap: string | null
  volume: string
  twitter: string
  telegram: string | null
  websites: string[]
  price_change: string
  holders: number
}
