export enum WalletPlatform {
  SOL = 'SOL',
  EVM = 'EVM',
  BEAR = 'BEAR',
}

export enum WalletChain {
  SOL = 'solana',
  ETH = 'ethereum',
  BSC = 'bsc',
  OP = 'optimism',
  ARB = 'arbitrum',
  BASE = 'base',
}

export type WalletChainSymbol = keyof typeof WalletChain

export const WALLET_CONFIG = {
  defaultChain: WalletChain.ETH,
  defaultPlatform: WalletPlatform.EVM,
}
