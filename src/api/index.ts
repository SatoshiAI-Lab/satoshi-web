import { Fetcher } from './fetcher'
import { URL_CONFIG } from '@/config/url'

// Saotshi API
export const fetchSatoshi = new Fetcher(URL_CONFIG.satoshiApi)

// Saotshi API
export const fetchSatoshiChain = new Fetcher(URL_CONFIG.satoshiChainDataApi)

// Chat API
export const fetchChat = new Fetcher(URL_CONFIG.satoshiChatApi)
