import { create } from 'zustand'

import { walletApi } from '@/api/wallet'
import { WalletPlatform } from '@/api/wallet/params'

import {
  UserCreateWalletResp,
  UserExportPrivateKeyResp,
  UserImportPrivateKeyResp,
  UserRenameWalletResp,
  UserDeleteWalletResp,
} from '@/api/wallet/params'

interface WalletCardProps extends Partial<UserCreateWalletResp> {}

interface States {
  currentWallet?: WalletCardProps
  wallets: WalletCardProps[]
  loading: boolean
}
interface Actions {
  createWallet(walletId: WalletPlatform): Promise<void>
  importWallet(privateKey: string): Promise<UserImportPrivateKeyResp>
  renameWallet(walletName: string): Promise<UserRenameWalletResp>
  setCurrentWallet(address?: string): void
  exportWalletPrivateKey(
    wallet_id: string
  ): Promise<void | UserExportPrivateKeyResp>
  getWallets(isLoading?: boolean, chain?: string): Promise<boolean>
  deleteWallet(wallet_id: string): Promise<UserDeleteWalletResp>
  setLoadingStatus(status: boolean): void
}

export const useWalletStore = create<States & Actions>((set, get) => ({
  currentWallet: undefined,
  wallets: [],
  loading: true,

  createWallet: async (walletType) => {
    set({ loading: true })
    await walletApi.createWallet({ platform: walletType })
  },
  importWallet: async (privateKey: string) => {
    return walletApi
      .importPrivateKey({
        private_key: privateKey,
        platform: 'SOL',
      })
      .then((res) => res.data)
  },
  exportWalletPrivateKey: async (wallet_id: string) => {
    return walletApi
      .exportPrivateKey({
        wallet_id: wallet_id,
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        console.log(err)
      })
  },
  renameWallet: async (walletName: string) => {
    return walletApi
      .renameWallet({
        wallet_id: get().currentWallet!.id!,
        name: walletName,
      })
      .then((res) => {
        return res.data
      })
  },
  setCurrentWallet: (address) => {
    const target = get().wallets.find((w) => w.address === address)
    // Please do not set it to `undefined`,
    // At the very least make sure it's `{}`
    set({ currentWallet: target ?? {} })
  },
  getWallets: async (isLoading = true, chain?: string): Promise<boolean> => {
    if (isLoading) {
      set({ wallets: [], loading: isLoading })
    }
    return new Promise((resolve, reject) => {
      walletApi
        .getWallets(chain)
        .then((res) => {
          set({ wallets: res.data.reverse(), loading: false })
          resolve(true)
        })
        .catch((err) => {
          reject(false)
        })
    })
  },
  deleteWallet: async (wallet_id: string) => {
    return walletApi
      .deleteWallet({
        wallet_id: wallet_id,
      })
      .then((res) => res.data)
  },
  setLoadingStatus(status: boolean) {
    set({ loading: status })
  },
}))
