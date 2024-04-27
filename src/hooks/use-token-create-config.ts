import { useEffect, useState } from 'react'

import { Chain, ChainSymbol } from '@/config/wallet'

type ConfigKey = keyof typeof configs

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

const configs: Record<string, Config> = {
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
export const useTokenCreateConfig = (chain?: string) => {
  const [config, setConfig] = useState<Config>()

  useEffect(() => {
    if (!chain) return

    setConfig(configs[chain as ConfigKey])
  }, [chain])

  return {
    config,
    configs,
    // If you need, you can manually get config.
    getConfig: (c?: string) => configs[c as ConfigKey],
  }
}
