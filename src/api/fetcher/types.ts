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
  status: number
  message: string
  data: T
}
