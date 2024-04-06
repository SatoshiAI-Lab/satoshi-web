import { fetchChat, fetchSatoshi } from '../index'

import type { ChatMointorRoomRes, ChatParams, ChatTransactionParams } from './types'

export const chatApi = {
  /** Chat API */
  async chat(params: ChatParams, signal?: AbortSignal) {
    return fetchChat.post('/chat', params, signal) as unknown as Promise<
      ReadableStream<Uint8Array>
    >
  },
  /** Transaction */
  transaction(params: ChatTransactionParams) {
    return fetchChat.post('/transaction_confirm', params)
  },

  /** Go to the mointor room id */
  async getMonitorRoomId(userId: string) {
    return fetchSatoshi.get<ChatMointorRoomRes>(`/api/v1/chat/${userId}/`)
  }
}
