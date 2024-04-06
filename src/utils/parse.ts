import { ChatResponseAnswer } from '@/api/chat/types'

interface ParseStreamStringOnParsed {
  (data: ChatResponseAnswer, result: string[], index: number): void
}

interface QueryPaserOptions {
  splitSymbol: string
  eqSymbol: string
  padQuestionMark: boolean
}

export const utilParse = {
  /**
   * parse event-stream response to string.
   * @param str Stream string.
   * @param onParsed Each parsing call, include this parsing result string.
   * @return Return string array.
   **/
  parseStreamString(str: string, onParsed: ParseStreamStringOnParsed) {
    const arr = str.trim().split('\n').filter(Boolean)
    return arr
      .map((m, i) => {
        const parsed = JSON.parse(m.replace('data: ', '')) as ChatResponseAnswer
        onParsed(parsed, arr, i)
        return parsed
      })
      .flat()
      .join('')
  },

  /**
   * Convert a object to query string(qs).
   */
  obj2Qs(obj: object, opts?: Partial<QueryPaserOptions>) {
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
  qs2Obj(query: string, opts?: Partial<QueryPaserOptions>) {
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
  toFixedNotRound(n: number, len: number) {
    const str = n.toString()
    const idx = str.indexOf('.') + 1

    return Number(str.slice(0, idx + len))
  },
}
