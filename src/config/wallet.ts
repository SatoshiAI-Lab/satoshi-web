export enum WalletPlatform {
  SOL = 'SOL',
  EVM = 'EVM',
  BEAR = 'BEAR',
}

export enum WalletChain {
  SOL = 'Solana',
  ETH = 'Ethereum',
  BSC = 'BSC',
  OP = 'Optimism',
  ARB = 'Arbitrum',
  BASE = 'BASE',
}

export type WalletChainSymbol = keyof typeof WalletChain

export const WALLET_CONFIG = {
  defaultChain: WalletChain.ETH,
  defaultPlatform: WalletPlatform.EVM,
}
