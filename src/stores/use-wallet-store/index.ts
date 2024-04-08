import { create } from 'zustand'

import { walletApi } from '@/api/wallet'
import { WalletPlatform } from '@/api/wallet/params'

import type { Actions, States } from './types'

export const useWalletStore = create<States & Actions>((set, get) => ({
  currentWallet: undefined,
  wallets: [],
  loading: true,
  createWallet: async (walletId: string) => {
    set({ loading: true })
    if (walletId === 'solana') {
      await walletApi.createWallet({
        platform: WalletPlatform.SOL,
      })
    }
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
  getWallets: async (isLoading = true): Promise<boolean> => {
    if (isLoading) {
      set({ wallets: [], loading: isLoading })
    }
    return new Promise((resolve, reject) => {
      walletApi
        .getWallets()
        .then((res) => {
          console.log('钱包列表', res.data)

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
