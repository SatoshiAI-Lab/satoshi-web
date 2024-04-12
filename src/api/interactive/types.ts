export interface GetHashStatusReq {
  chain?: string // Default: Solana
  hash_tx: string
}

export enum TokenCreateStatus {
  Waiting, // if Waiting, should be polling request.
  Success,
  Timeout,
  Failed,
}

export interface GetHashStatusRes {
  status: TokenCreateStatus
  created_at: number
}

export interface CreateTokenReq {
  chain?: string
  name: string
  symbol: string
  decimals: number
  desc?: string
  amount?: number
}

export interface CreateTokenRes {
  hash_tx: string
  status: TokenCreateStatus
}

export interface MintTokenReq {
  chain?: string
  created_hash: string
  amount: number
}

export interface MintTokenRes {
  hash_tx: string
  address: string
  status: TokenCreateStatus
}
