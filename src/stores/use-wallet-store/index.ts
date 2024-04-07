import { create } from 'zustand'

import { walletApi } from '@/api/wallet'

import type { Actions, States } from './types'

export const useWalletStore = create<States & Actions>((set, get) => ({
  currentWallet: {} as States['currentWallet'],
  wallets: [],
  loading: true,
  createWallet: async (walletId: string) => {
    set({ loading: true })
    if (walletId === 'solana') {
      await walletApi.createWallet({
        platform: 'SOL',
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
        wallet_id: get().currentWallet.id!,
        name: walletName,
      })
      .then((res) => {
        return res.data
      })
  },
  setCurrentWallet: (address) => {
    set({ currentWallet: get().wallets.find((w) => w.address === address) })
  },
  getWallets: async (): Promise<boolean> => {
    set({ wallets: [], loading: true })
    return new Promise((resolve, reject) => {
      walletApi
        .getWallets()
        .then((res) => {
          set({ wallets: res.data.reverse(), loading: false })
        })
        .then(() => resolve(true))
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
