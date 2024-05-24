export interface GetHashStatusReq {
  chain?: string // Default: Solana
  hash_tx: string
  provider?: string
}
export interface GetCrossHashStatusReq {
  chain?: string // Default: Solana
  hash_tx: string
  provider?: string
}
export interface GetCrossHashStatusRes {
  status: 'PENDING' | 'SUCCESS' | 'FAILURE' | 'REFUND' | 'NOT_FOUND'
  to_url: string
  to_hash_tx: string
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
  id: string
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
  address: string
}

export interface MintTokenReq {
  id: string
  chain?: string
  created_hash: string
  amount: number
}

export interface MintTokenRes {
  hash_tx: string
  address: string
  status: TokenCreateStatus
}
