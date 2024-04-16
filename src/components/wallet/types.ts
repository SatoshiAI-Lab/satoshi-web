import { UserCreateWalletResp } from '@/api/wallet/params'

export interface WalletDialogProps {
  open: boolean
  onClose?(): void
  title?: string
  address?: string
  showButtons?: boolean
  // If not null & find same wallet, only show this wallet
  onlyWallet?: UserCreateWalletResp
  onlyWalletRefetch?: () => void
}

export interface WalletCardProps {
  id?: string
  name?: string
  address?: string
  value?: string
  token?: number
  platform: string
  copyAddress(address: string): void
  renameWallet(address: string): void
  exportKey(address: string): void
  deleteWallet(address: string): void
}
