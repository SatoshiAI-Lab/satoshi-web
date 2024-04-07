interface QueryPaserOptions {
  splitSymbol: string
  eqSymbol: string
  padQuestionMark: boolean
}

/**
 * `query` Parameter processing
 * - `toString`: Object to Query string
 * - `toObject`: Query string to Object
 */
export const queryPraser = {
  toString(obj: object, opts?: Partial<QueryPaserOptions>) {
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
  toObject(query: string, opts?: Partial<QueryPaserOptions>) {
    const { splitSymbol = '&', eqSymbol = '=' } = opts ?? {}
    const removeQuestionMark = query.startsWith('?') ? query.slice(1) : query
    const result = removeQuestionMark.split(splitSymbol).reduce((p, q) => {
      const [key, value] = q.split(eqSymbol)
      return (p[key] = value), p
    }, {} as Record<string, string>)

    return result
  },
}
