import { Chain, Platform } from '@/config/wallet'

import type { ChatResponseWalletListToken } from '../chat/types'

interface UserCreateWalletReq {
  /**
   * Wallet platform: SOL or EVM, default: SOL
   */
  platform?: Platform
}

export type GetWalletsRes = Record<Chain, UserCreateWalletResp[]>

interface UserCreateWalletResp {
  id: string
  name: string
  address: string
  platform: string
  added_at: string
  user: string
  value: string
  tokens: ChatResponseWalletListToken[]
  chain?: {
    id: number
    logo: string
    name: string
  }
}

interface UserExportPrivateKeyResp {
  private_key: string
}

interface UserImportPrivateKeyReq {
  private_key: string
  /**
   * Wallet platform: SOL or EVM, default: SOL
   */
  platform?: Platform
}

interface UserImportPrivateKeyResp extends UserCreateWalletResp {}

interface UserRenameWalletReq {
  wallet_id: string
  name: string
}

interface UserExportPrivateKey {
  wallet_id: string
}

interface UserRenameWalletResp {
  name: string
}

interface UserDeleteWalletReq {
  wallet_id: string
}

interface UserDeleteWalletResp {
  msg: string
}

interface GetChainsRes {
  chains: {
    name: string
    logo: string
  }[]
  platforms: Platform[]
}

export type {
  UserCreateWalletReq,
  UserCreateWalletResp,
  UserImportPrivateKeyReq,
  UserExportPrivateKey,
  UserExportPrivateKeyResp,
  UserImportPrivateKeyResp,
  UserRenameWalletReq,
  UserRenameWalletResp,
  UserDeleteWalletReq,
  UserDeleteWalletResp,
  GetChainsRes,
}
