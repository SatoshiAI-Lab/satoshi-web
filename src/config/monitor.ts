export enum MonitorConfig {
  News,
  Twitter,
  Announcement,
  Trade,
  Pool,
}

export const MONITOR_CONFIG = {
  minPool: 1000,
  maxPool: 1000000,
}

export enum MonitorPoolStatus {
  Normal,
  Risk,
  Unknown,
}

export const monitorWalletSupperChain = [
  {
    logo: 'https://img.mysatoshi.ai/chains/logo/Optimism.png',
    name: 'Optimism',
  },
  { name: 'Solana', logo: 'https://img.mysatoshi.ai/chains/logo/Solana.png' },
]
