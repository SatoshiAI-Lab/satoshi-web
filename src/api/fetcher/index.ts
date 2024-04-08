import { utilParse } from '@/utils/parse'
import { useStorage } from '@/hooks/use-storage'

import type { AnyObject } from '@/types/types'
import type { FetcherResponse, FetcherOptions } from './types'

const excludesAuthPath = [
  '/api/v1/coin/list/',
  '/api/v1/register/',
  '/api/v1/mine/',
  '/token/list',
  '/chat',
]

/**
 * The API may appear to return data directly, so wrap a layer
 * @param result JSON Result
 * @param response
 * @returns
 */
const warpResData = (result: any, response: Response) => {
  if (!result.hasOwnProperty('data')) {
    return {
      status: response.status,
      data: result,
    } as any
  }

  return result
}

/**
 * Wrapper for native fetch.
 * @param path API path.
 * @param options Fetch options, see `FetcherOptions`, `method` must not be null.
 * @returns Return `ReadableStream` or `JSON` data
 */
export async function fetcher<T = ReadableStream<Uint8Array>>(
  path: string,
  options: FetcherOptions
): Promise<T> {
  const {
    baseURL,
    method,
    query,
    headers,
    body,
    signal,
    needAuth = true,
  } = options
  const stringQuery = method === 'GET' ? utilParse.objToQs(query ?? {}) : ''
  const url = baseURL + path + stringQuery
  // We can use this hook, because it's not relying React hooks.
  const token = useStorage().getLoginToken()

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: needAuth || token ? `Bearer ${token}` : '',
        ...headers,
      },
      body: method !== 'GET' ? JSON.stringify(body) : null,
      credentials: 'include',
      signal,
    })

    // Handle server error.
    if (response.status >= 500) {
      console.error(`[Server Internal Error]: ${response.status}`)
      return Promise.reject(response.body)
    }

    // Handle request success.
    if (response.status >= 200 && response.status <= 299) {
      const isJson = response.headers.get('Content-Type') === 'application/json'

      if (!isJson) return response.body! as T

      // if (!result.hasOwnProperty('status') || result.status !== 200) {
      //   console.error(`[Response Error]: ${result?.message}`)
      //   return Promise.reject(result)
      // }

      const result = await response.json()

      return warpResData(result, response)
    }

    return Promise.reject(warpResData(await response.json(), response))
  } catch (e) {
    console.error(`[Request Error]: ${e}`)
    return Promise.reject(e)
  }
}

export class Fetcher<R = ReadableStream<Uint8Array>> {
  baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  get<T = R>(path: string, query?: AnyObject) {
    return fetcher<FetcherResponse<T>>(path, {
      method: 'GET',
      baseURL: this.baseURL,
      query,
    })
  }

  post<T = R>(path: string, body?: object, signal?: AbortSignal) {
    return this._fetcher<T>(path, 'POST', body, signal)
  }

  patch<T = R>(path: string, body?: object, signal?: AbortSignal) {
    return this._fetcher<T>(path, 'PATCH', body, signal)
  }

  put<T = R>(path: string, body?: object) {
    return this._fetcher<T>(path, 'PUT', body)
  }

  delete<T = R>(path: string, body?: object) {
    return this._fetcher<T>(path, 'DELETE', body)
  }

  _fetcher<V>(
    path: string,
    method: FetcherOptions['method'],
    body?: object,
    signal?: AbortSignal
  ) {
    return fetcher<FetcherResponse<V>>(path, {
      method,
      baseURL: this.baseURL,
      body,
      signal,
      needAuth: !excludesAuthPath.includes(path),
    })
  }
}
