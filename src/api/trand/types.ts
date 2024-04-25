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
}
