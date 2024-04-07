interface UserCreateWalletReq {
  /**
   * Wallet platform: SOL or EVM, default: SOL
   */
  platform?: string
}

interface WalletToken {
  symbol: string
  name: string
  mintAddress: string
  amount: string
  priceUsd: string
  valueUsd: string
  logoUrl: string
  decimals: number
}

interface UserCreateWalletResp {
  id: string
  name: string
  address: string
  platform: string
  added_at: string
  user: string
  value: string
  tokens: WalletToken[]
}

interface UserExportPrivateKeyResp {
  private_key: string
}

interface UserImportPrivateKeyReq {
  private_key: string
  /**
   * Wallet platform: SOL or EVM, default: SOL
   */
  platform?: string
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
export type {
  UserCreateWalletReq,
  UserCreateWalletResp,
  UserImportPrivateKeyReq,
  UserExportPrivateKey,
  UserExportPrivateKeyResp,
  WalletToken,
  UserImportPrivateKeyResp,
  UserRenameWalletReq,
  UserRenameWalletResp,
  UserDeleteWalletReq,
  UserDeleteWalletResp,
}
