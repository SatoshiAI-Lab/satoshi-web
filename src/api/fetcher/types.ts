export interface FetcherOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  baseURL: string
  headers?: HeadersInit
  body?: object
  query?: object
  requestInit?: any
  signal?: AbortSignal
  needAuth?: boolean
}

export interface FetcherResponse<T = null> {
  code: ResponseCode
  message: string
  data: T
}

export enum ResponseCode {
  Success = 200,

  Err = 400,

  Auth = 401,

  CrossChainNotFindTranfer = 1007,

  CrossChainLiquidity = 1004,

  CrossChainPath = 2001,

  CrossChainMinAmout = 1005,

  CrossChainMaxAmout = 1006,
}
