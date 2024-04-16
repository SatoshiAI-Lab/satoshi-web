import { CreateTokenReq } from '@/api/interactive/types'

export interface CreateTokenInfo extends CreateTokenReq {
  total: number
}
