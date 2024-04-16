/**
 * Management project URLs.
 */
export const URL_CONFIG = {
  satoshiApi: 'https://api.mysatoshi.ai',

  satoshiChainDataApi: process.env.NEXT_PUBLIC_SATOSHI_CHAIN_DATA_API!,

  satoshiMonitorApi: 'wss://api.mysatoshi.ai',

  satoshiChatApi: process.env.NEXT_PUBLIC_SATOSHI_AI_API!,

  cdn: 'https://img.mysatoshi.ai',

  kline: 'wss://ohlcv.mysatoshi.ai/ws', // dev API
} as const
