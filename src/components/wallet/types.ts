export interface WalletDialogProps {
  open: boolean
  onClose?(): void
  title?: string
  address?: string
  finish?: boolean
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
