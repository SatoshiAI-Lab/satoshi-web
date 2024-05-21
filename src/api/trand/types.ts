import { Chain } from '@/config/wallet'

export interface BuyTokenParams {
  chain?: Chain
  input_token: string
  output_token: string
  amount: string
  slippageBps?: number
}
export interface BuyTokenData {
  hash_tx: string
  url: string
}

export interface CrossSwapData {
  hash_tx: string
  url: string
  provider: string
  minimum_amount: number
  max_amount: number
}

export interface CrossSwapParams {
  crossAmount: string
  fromData: FromData
  providerData?: ProviderData
  slippageBps: number
  toData: ToData
  [property: string]: any
}

export interface FromData {
  chain: string
  tokenAddress: string
  [property: string]: any
}

export interface ProviderData {
  approval_address: string
  bridge_id: number
  [property: string]: any
}

export interface ToData {
  chain: string
  tokenAddress: string
  walletAddress?: string
  [property: string]: any
}
export interface BuyTokenData {
  hash_tx: string
  url: string
}

export interface CrossPriceQuery {
  /**
   * 交易额，不需要包含精度
   */
  crossAmount: string
  fromData: FromData
  /**
   * 滑点，默认为 10% 即 1000；1 为 0.01%
   */
  slippageBps: number
  toData: ToData
  [property: string]: any
}

export interface CrossFeeData {
  provider: string
  max_amount?: string
  minimum_amount?: string

  /**
   * 不同服务商获得的数据会有所不同
   */
  provider_data: CrossProviderData
  [property: string]: any
}

/**
 * 不同服务商获得的数据会有所不同
 */
export interface CrossProviderData {
  bridge_id: number
  /**
   * (必返回) 预估跨链花费的token数量，不包含精度
   */
  cross_chain_fee: string
  /**
   * (必返回) 预估跨链花费的token地址
   */
  cross_chain_fee_token_address: string
  /**
   * (必返回) 目标链预估获得的数量，不包含精度
   */
  estimate_gain_amount: string
  [property: string]: any
}

export interface CrossStatusQuery {
  chain?: string
  hash_tx?: string
  provider?: string
  [property: string]: any
}

export interface CrossStatusData {
  status: string
  [property: string]: any
}
