import { create } from 'zustand'

import { GetChainsRes, WalletPlatform } from '@/api/wallet/params'

import type { UserCreateWalletResp } from '@/api/wallet/params'

export interface WalletCardProps extends Partial<UserCreateWalletResp> {}

interface States {
  wallets: WalletCardProps[]
  chains: GetChainsRes['chains']
  platforms: GetChainsRes['platforms']
  currentWallet?: WalletCardProps
  selectedChain: string
  selectedPlatform: WalletPlatform
}

interface Actions {
  setWallets(wallets: WalletCardProps[]): void
  setChains(chains: GetChainsRes['chains']): void
  setPlatforms(platforms: GetChainsRes['platforms']): void
  setCurrentWallet(address?: string): void
  setSelectedChain(chain: string): void
  setSelectedPlatform(platform: WalletPlatform): void
}

export const useWalletStore = create<States & Actions>((set, get) => ({
  wallets: [],
  chains: [],
  platforms: [],
  currentWallet: undefined,
  selectedChain: '',
  selectedPlatform: WalletPlatform.SOL,

  setWallets: (wallets) => set({ wallets }),
  setChains: (chains) => set({ chains }),
  setPlatforms: (platforms) => set({ platforms }),
  setCurrentWallet: (address) => {
    const target = get().wallets.find((w) => w.address === address)
    // Please do not set it to `undefined`,
    // At the very least make sure it's `{}`
    set({ currentWallet: target ?? {} })
  },
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
}))
