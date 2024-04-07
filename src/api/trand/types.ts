export interface BuyTokenParams {
  platform?: 'SOL' | 'EVM'
  input_token: string
  output_token: string
  amount: string
  slippageBps?: number
}
export interface BuyTokenData {
  hash_tx: string
}