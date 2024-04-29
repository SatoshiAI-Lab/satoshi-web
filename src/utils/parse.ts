import toast from 'react-hot-toast'

import { ChatResponse } from '@/api/chat/types'

type OnParse = (data: ChatResponse, isFirst: boolean) => void

interface QueryPaserOptions {
  splitSymbol: string
  eqSymbol: string
  padQuestionMark: boolean
}

export const utilParse = {
  /**
   * parse event-stream response to string.
   * @param str Stream string.
   * @param onParsed Each parsed callback.
   * @return Result string array.
   **/
  streamStrToJson(str: string, onParsed: OnParse) {
    let isFirstCall = true
    const splited = str.trim().split('\n').filter(Boolean)

    const result = splited.map((m) => {
      try {
        const replaced = m.startsWith('data: ') ? m.replace('data: ', '') : m
        const parsed = JSON.parse(replaced) as ChatResponse

        onParsed(parsed, isFirstCall)
        isFirstCall = false
        return parsed
      } catch (err) {
        toast.error(`[ParseStream Error]: ${err}`)
        console.error('[ParseStream Error]:', err)
        console.error('[ParseStream Error m]:', m)

        return { text: err }
      }
    })

    return result
  },

  /**
   * Convert a object to query string(qs).
   */
  objToQs(obj: object, opts?: Partial<QueryPaserOptions>) {
    const {
      splitSymbol = '&',
      eqSymbol = '=',
      padQuestionMark = true,
    } = opts ?? {}
    const result = Object.entries(obj)
      .map((arr) => arr.join(eqSymbol))
      .join(splitSymbol)

    if (padQuestionMark) return '?' + result

    return result
  },

  /**
   * Convert a query string(qs) to object.
   */
  qsToObj(query: string, opts?: Partial<QueryPaserOptions>) {
    const { splitSymbol = '&', eqSymbol = '=' } = opts ?? {}
    const removeQuestionMark = query.startsWith('?') ? query.slice(1) : query
    const result = removeQuestionMark.split(splitSymbol).reduce((p, q) => {
      const [key, value] = q.split(eqSymbol)
      return (p[key] = value), p
    }, {} as Record<string, string>)

    return result
  },

  /**
   * To fixed a number, but not round.
   * @param n A number.
   * @param len to fixed length.
   * @returns Return a number result.
   */
  noRoundFixed(n: number, len: number) {
    const str = n.toString()
    const idx = str.indexOf('.') + 1

    return Number(str.slice(0, idx + len))
  },

  bufferToBase64(buffer: ArrayBuffer) {
    const u8Arr = new Uint8Array(buffer)
    let str = ''

    for (let i = 0; i < u8Arr.length; i++) {
      str += String.fromCharCode(u8Arr[i])
    }

    return btoa(str)
  },
}
