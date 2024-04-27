export enum Platform {
  Sol = 'SOL',
  Evm = 'EVM',
  Bear = 'BEAR',
}

export enum Chain {
  Sol = 'solana',
  Eth = 'ethereum',
  Bsc = 'bsc',
  Op = 'optimism',
  Arb = 'arbitrum',
  Base = 'base',
  ZkSync = 'zkSync',
  Linea = 'linea',
  Blast = 'blast',
  Fantom = 'fantom',
  Merlin = 'merlin',
  Bevm = 'bevm',
  Scroll = 'scroll',
}

export type ChainSymbol = Uppercase<keyof typeof Chain>

export const WALLET_CONFIG = {
  defaultChain: Chain.Eth,
  defaultPlatform: Platform.Evm,
}
