import { Fetcher } from './fetcher'
import { URL_CONFIG } from '@/config/url'

// Saotshi API
export const fetchSatoshi = new Fetcher(URL_CONFIG.satoshiApi)

// Chat API
export const fetchChat = new Fetcher(URL_CONFIG.satoshiChatApi)
