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

  createToken(params: CreateTokenReq) {
    const { id, ...req } = params
    return fetchSatoshi.post<CreateTokenRes>(`/api/v1/coin/create/${id}/`, req)
  },

  mintToken(params: MintTokenReq) {
    const { id, ...req } = params
    return fetchSatoshi.post<MintTokenRes>(`/api/v1/coin/mint/${id}/`, req)
  },
}
