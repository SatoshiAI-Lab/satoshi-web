import { create } from 'zustand'

import { WALLET_CONFIG, WalletChain } from '@/config/wallet'

import type { GetChainsRes, GetWalletsRes } from '@/api/wallet/params'
import type { UserCreateWalletResp } from '@/api/wallet/params'

export interface WalletCardProps extends Partial<UserCreateWalletResp> {}

interface States {
  wallets: WalletCardProps[]
  allWallets: GetWalletsRes
  chains: GetChainsRes['chains']
  platforms: GetChainsRes['platforms']
  currentWallet?: WalletCardProps
  selectedChain: WalletChain
  selectedPlatform: string
}

interface Actions {
  setWallets(wallets: WalletCardProps[]): void
  setAllWallets(wallets: GetWalletsRes): void
  setChains(chains: GetChainsRes['chains']): void
  setPlatforms(platforms: GetChainsRes['platforms']): void
  setCurrentWallet(address?: string): void
  setSelectedChain(chain: string): void
  setSelectedPlatform(platform: string): void
}

export const useWalletStore = create<States & Actions>((set, get) => ({
  wallets: [],
  allWallets: {} as GetWalletsRes,
  chains: [],
  platforms: [],
  currentWallet: undefined,
  selectedChain: WALLET_CONFIG.defaultChain,
  selectedPlatform: WALLET_CONFIG.defaultPlatform,

  setWallets: (wallets) => set({ wallets }),
  setAllWallets: (allWallets) => set({ allWallets }),
  setChains: (chains) => set({ chains }),
  setPlatforms: (platforms) => set({ platforms }),
  setCurrentWallet: (address) => {
    const target = get().wallets.find((w) => w.address === address)
    // Please do not set it to `undefined`,
    // At the very least make sure it's `{}`
    set({ currentWallet: target ?? {} })
  },
  setSelectedChain: (chain) => set({ selectedChain: chain as WalletChain }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
}))
