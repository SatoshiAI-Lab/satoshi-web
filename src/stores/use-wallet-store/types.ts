import {
  UserCreateWalletResp,
  UserExportPrivateKeyResp,
  UserImportPrivateKeyResp,
  UserRenameWalletResp,
  UserDeleteWalletResp,
} from '@/api/wallet/params'

export interface WalletCardProps extends Partial<UserCreateWalletResp> {}

export interface States {
  currentWallet?: WalletCardProps
  wallets: WalletCardProps[]
  loading: boolean
}
export interface Actions {
  createWallet(walletId: string): Promise<void>
  importWallet(privateKey: string): Promise<UserImportPrivateKeyResp>
  renameWallet(walletName: string): Promise<UserRenameWalletResp>
  setCurrentWallet(address?: string): void
  exportWalletPrivateKey(
    wallet_id: string
  ): Promise<void | UserExportPrivateKeyResp>
  getWallets(isLoading?: boolean): Promise<boolean>
  deleteWallet(wallet_id: string): Promise<UserDeleteWalletResp>
  setLoadingStatus(status: boolean): void
}
