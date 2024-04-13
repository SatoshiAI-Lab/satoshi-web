import { WalletChain } from "@/config/wallet"

export interface BuyTokenParams {
  chain?: WalletChain
  input_token: string
  output_token: string
  amount: string
  slippageBps?: number
}
export interface BuyTokenData {
  hash_tx: string
}