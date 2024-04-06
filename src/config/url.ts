/**
 * Management project URLs.
 */
export const URL_CONFIG = {
  satoshiApi: process.env.NEXT_PUBLIC_SATOSHI_API!, // TODO: Add API URL

  satoshiChainDataApi: process.env.NEXT_PUBLIC_SATOSHI_CHAIN_DATA_API!, // TODO: Add API URL
  
  satoshiMonitorApi: process.env.NEXT_PUBLIC_SATOSHI_MONITOR_API!,

  satoshiChatApi: 'https://ai.mysatoshi.ai',

  cdn: 'https://img.mysatoshi.ai',
} as const
