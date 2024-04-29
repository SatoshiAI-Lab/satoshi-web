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

export interface FetcherResponse<T> {
  code: ResponseCode
  message: string
  data: T
}

export enum ResponseCode {
  None = -1,

  Success = 200,

  Err = 400,
  ErrAuth = 401,
}
