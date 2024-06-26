import { create } from 'zustand'

import { WALLET_CONFIG, Chain, Platform } from '@/config/wallet'

import type { GetChainsRes, GetWalletsRes } from '@/api/wallet/params'
import type { UserCreateWalletResp } from '@/api/wallet/params'
import { utilWallet } from '@/utils/wallet'
import { cloneDeep } from 'lodash'

export interface PartialWalletRes extends Partial<UserCreateWalletResp> {}

export interface WalletPlatform {
  // [Platform.Bear]?: UserCreateWalletResp[]
  [Platform.Evm]?: UserCreateWalletResp[]
  [Platform.Sol]?: UserCreateWalletResp[]
}

interface States {
  loadingAllWallet: boolean
  wallets: PartialWalletRes[]
  allWallets: GetWalletsRes
  walletList: PartialWalletRes[]
  walletPlatform: WalletPlatform
  chains: GetChainsRes['chains']
  platforms: GetChainsRes['platforms']
  currentWallet?: PartialWalletRes
  selectedChain: Chain
  selectedPlatform: string
}

interface Actions {
  setWallets(wallets: PartialWalletRes[]): void
  setAllWallets(wallets: GetWalletsRes): void
  setChains(chains: GetChainsRes['chains']): void
  setPlatforms(platforms: GetChainsRes['platforms']): void
  setCurrentWallet(wallet: PartialWalletRes): void
  setSelectedChain(chain: string): void
  setSelectedPlatform(platform: string): void

  // Find wallet by name among all wallets.
  findWallet(name: string): PartialWalletRes | undefined

  // Whether have wallet on any or specific chain.
  hasWallet(chain?: Chain): boolean
}

export const useWalletStore = create<States & Actions>((set, get) => ({
  loadingAllWallet: true,
  wallets: [],
  allWallets: {} as GetWalletsRes,
  walletList: [],
  chains: [],
  platforms: [],
  currentWallet: undefined,
  selectedChain: WALLET_CONFIG.defaultChain,
  selectedPlatform: WALLET_CONFIG.defaultPlatform,
  walletPlatform: {},

  setWallets: (wallets) => set({ wallets }),
  setAllWallets: (allWallets) => {
    const walletList = []
    for (const key in allWallets) {
      walletList.push(...allWallets[key as Chain])
    }

    utilWallet.sortWalletByCreated(walletList)

    let walletPlatform: WalletPlatform = {}
    walletList.forEach((walletItem) => {
      // 把代币的链补充上
      walletItem.tokens = walletItem.tokens.map((t) => {
        t.chain = walletItem.chain
        return t
      })

      const wallets = walletPlatform[walletItem.platform]

      if (wallets?.length) {
        // 找出相同ID的钱包
        const wallet = wallets.find((w) => w.id === walletItem.id)
        if (!wallet) {
          // 新的钱包
          wallets.push({ ...walletItem })
        } else {
          // 已经存在的钱包直接放代币进去
          wallet.tokens?.push(...walletItem.tokens)
        }
      } else {
        // 没有平台就初始化
        walletPlatform[walletItem.platform] = [cloneDeep(walletItem)]
      }
    })

    set({
      allWallets,
      walletList,
      walletPlatform,
    })
  },
  setChains: (chains) => {
    // Pin the scroll chain to top.
    const scrollIdx = chains.findIndex((c) => c.name === Chain.Scroll)
    if (scrollIdx !== -1) {
      chains.unshift(chains.splice(scrollIdx, 1)[0])
    }
    set({ chains })
  },
  setPlatforms: (platforms) => set({ platforms }),
  setCurrentWallet: (wallet) => {
    // Please do not set it to `undefined`,
    // At the very least make sure it's `{}`
    set({ currentWallet: wallet ?? {} })
  },
  setSelectedChain: (chain) => set({ selectedChain: chain as Chain }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  findWallet: (name) => {
    if (!name?.trim()) return

    const allWallets = Object.values(get().allWallets).flat()
    return allWallets.find((w) => w.name === name)
  },
  hasWallet(chain) {
    const { allWallets } = get()

    if (chain) return !!allWallets[chain].length
    return !!Object.values(allWallets).length
  },
}))
