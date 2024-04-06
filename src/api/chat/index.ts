import { fetchChat } from '../index'

import type { ChatParams, ChatTransactionParams } from './types'

export const chatApi = {
  /** Chat API */
  async chat(params: ChatParams, signal?: AbortSignal) {
    return fetchChat.post('/chat', params, signal)
  },
  /** Transaction */
  transaction(params: ChatTransactionParams) {
    return fetchChat.post('/transaction_confirm', params)
  },
}
