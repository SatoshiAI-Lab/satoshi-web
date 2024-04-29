import { useEffect, useMemo, useState } from 'react'

import { Chain, type ChainSymbol } from '@/config/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Config {
  symbol: ChainSymbol
  nativeToken: ChainSymbol
  minBalance: number
  decimals: number
}

const makeEvmConfig = (chain: Chain, options?: Partial<Config>) => {
  const {
    symbol = 'ETH',
    nativeToken = 'ETH',
    minBalance = 0.05,
    decimals = 18,
  } = options ?? {}

  return {
    [chain]: {
      symbol,
      nativeToken,
      minBalance,
      decimals,
    },
  }
}

const supports: Record<string, Config> = {
  [Chain.Sol]: {
    symbol: 'SOL', // The token symbol.
    nativeToken: 'SOL', // The chain native token.
    minBalance: 0.2, // Wallet min balance.
    decimals: 9, // The token decimals.
  },
  ...makeEvmConfig(Chain.Eth),
  ...makeEvmConfig(Chain.Op, { symbol: 'OP', minBalance: 0.005 }),
  ...makeEvmConfig(Chain.Arb, { symbol: 'ARB', minBalance: 0.005 }),
  ...makeEvmConfig(Chain.Base, { symbol: 'BASE', minBalance: 0.005 }),
  ...makeEvmConfig(Chain.Bsc, { symbol: 'BSC', minBalance: 0.005 }),
  ...makeEvmConfig(Chain.Scroll, { symbol: 'SCROLL', minBalance: 0.005 }),
}

// Unified management create token config.
// If chain is not null, will be auto get config.
export const useTokenCreateConfig = (chain?: Chain) => {
  const [config, setConfig] = useState<Config>()
  const { chains } = useWalletStore()
  const unsupports = useMemo(
    () => chains.filter((c) => !supports[c.name]),
    [chains]
  )

  const isSupport = (c?: Chain) => !!supports[c ?? chain ?? '']

  const isUnsupport = (c?: Chain) => !isSupport(c)

  useEffect(() => {
    if (!chain) return

    setConfig(supports[chain])
  }, [chain])

  return {
    config,
    supports,
    unsupports,
    isSupport,
    isUnsupport,
  }
}
