import { fetchChat, fetchSatoshi } from '../index'

import type {
  ChatMointorRoomRes,
  ChatParams,
  ChatTransactionParams,
} from './types'

export const chatApi = {
  /** Chat API */
  chat(params: ChatParams, signal?: AbortSignal) {
    return fetchChat.post('/chat', params, signal) as unknown as Promise<
      ReadableStream<Uint8Array>
    >
  },
  clearHistory() {
    return fetchChat.post('/clear-history')
  },

  /** Transaction */
  transaction(params: ChatTransactionParams) {
    return fetchChat.post('/transaction_confirm', params)
  },

  /** Go to the mointor room id */
  async getMonitorRoomId(userId: string) {
    return fetchSatoshi.get<ChatMointorRoomRes>(`/api/v1/chat/${userId}/`)
  },

  /** Get speech to text */
  /* async getSpeechText(webmStr: string): Promise<ReadableStream> {
    return fetchChat.post('/speech', {
      data: webmStr,
      voice_type: '.webm',
      user_info: {
        username: '1475289190@qq.com',
        is_vip: false,
        preference: {
          language: '1',
        },
      },
      history: [],
      question: '1',
      stream: false,
      intent_stream: '',
    }) as unknown as ReadableStream
  }, */
  async getVoidText(webmStr: string): Promise<{ data: { text: string } }> {
    return fetchChat.post('/voice', {
      data: webmStr,
      voice_type: '.webm',
    })
  },
}
