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
  [property: string]: any
}

export interface ToData {
  chain: string
  tokenAddress: string
  walletAddress: string
  [property: string]: any
}
export interface BuyTokenData {
  hash_tx: string
  url: string
}
