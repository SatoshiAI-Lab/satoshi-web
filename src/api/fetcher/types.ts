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

  CrossChianLiquidity = 1004,

  CrossChianPath = 2001,

  CrossChianMinAmout = 1005,

  CrossChianMaxAmout = 1006,
}
