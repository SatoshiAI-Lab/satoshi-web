import type { UserCreateWalletResp } from '@/api/wallet/params'
import type { PartialWalletRes } from '@/stores/use-wallet-store'

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
  chain: any
  id?: string
  name?: string
  address?: string
  value?: string
  copyAddress(wallet: PartialWalletRes): void
  renameWallet(wallet: PartialWalletRes): void
  exportKey(wallet: PartialWalletRes): void
  deleteWallet(wallet: PartialWalletRes): void
}
