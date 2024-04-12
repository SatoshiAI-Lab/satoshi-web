import { useEffect, useState } from 'react'

import { WalletChain, WalletChainSymbol } from '@/config/wallet'

type ConfigKey = keyof typeof configs

interface Config {
  symbol: WalletChainSymbol
  nativeToken: WalletChainSymbol
  minBalance: number
  decimals: number
}

const configs: Record<string, Config> = {
  [WalletChain.SOL]: {
    symbol: 'SOL',
    nativeToken: 'SOL',
    minBalance: 0.2, // Wallet min balance.
    decimals: 9, // The chain decimals.
  },
  [WalletChain.OP]: {
    symbol: 'OP',
    nativeToken: 'ETH',
    minBalance: 0.005,
    decimals: 18,
  },
  // ETH is too expensive, disabled at the moment.
  // [WalletChain.ETH]: {
  //   symbol: 'OP',
  //   minBalance: 0.05,
  //   decimals: 18,
  // },
}

// Unified management create token config.
// If chain is not null, will be auto get config.
export const useCreateTokenConfig = (chain?: string) => {
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
