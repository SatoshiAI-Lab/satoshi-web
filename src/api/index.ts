import { Fetcher } from './fetcher'

// Saotshi API
export const fetchSatoshi = new Fetcher(process.env.NEXT_PUBLIC_SATOSHI_API!)

// Chat API
export const fetchChat = new Fetcher(process.env.NEXT_PUBLIC_SATOSHI_AI_API!)
