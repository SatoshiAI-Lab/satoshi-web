import { fetchSatoshi } from '..'

import type {
  CreateTokenReq,
  CreateTokenRes,
  GetHashStatusReq,
  GetHashStatusRes,
  MintTokenReq,
  MintTokenRes,
} from './types'

export const interactiveApi = {
  getHashStatus(params: GetHashStatusReq) {
    return fetchSatoshi.get<GetHashStatusRes>('/api/v1/hash/status/', params)
  },

  createToken(id: string, params: CreateTokenReq) {
    return fetchSatoshi.post<CreateTokenRes>(
      `/api/v1/coin/create/${id}/`,
      params
    )
  },

  mintToken(id: string, params: MintTokenReq) {
    return fetchSatoshi.post<MintTokenRes>(`/api/v1/coin/mint/${id}/`, params)
  },
}
