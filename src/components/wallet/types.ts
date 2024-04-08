export interface WalletDialogProps {
  open: boolean
  onClose?(): void
  title?: string
  address?: string
  finish?: boolean
  showButtons?: boolean
  // If not null & find same wallet, only show this wallet
  onlyWalletAddr?: string
}

export interface WalletCardProps {
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
