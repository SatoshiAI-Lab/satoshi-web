import numeral from 'numeral'

import { utilParse } from './parse'

/**
 * Utilities functions for formatting
 */
export const utilFmt = {
  addr(address?: string, len = 5) {
    if (address) {
      return `${address.slice(0, len)}...${address.slice(-len, address.length)}`
    }
    return ''
  },
  email(email?: string) {
    if (email) {
      return email.length > 14
        ? `${email.slice(0, 6)}...${email.slice(-6, email.length)}`
        : email
    }
    return ''
  },
  ellipsis(str: string, len = 8) {
    return str.length > len ? `${str.slice(0, len)}...` : str
  },
  token(value?: number, fixed = 2) {
    if (!value) return 0
    if (value >= 10 && value < 100) return utilParse.noRoundFixed(value, fixed)
    if (value >= 100) return utilParse.noRoundFixed(value, 1)

    const decimalIndex = value.toString().indexOf('.')
    if (decimalIndex !== -1) {
      const decimalPart = value.toString().slice(decimalIndex + 1)
      const zeroLen = decimalPart.match(/^0*/)?.[0].length ?? 0
      const lastNumbers = decimalPart.replace(/^0+/, '')
      const slicedLastNum = lastNumbers.slice(0, fixed)
      const result = `0.0{${zeroLen}}${slicedLastNum}`

      if (zeroLen < 2) return `0.${slicedLastNum}`

      return result
    } else {
      return numeral(value).format('0.00')
    }
  },
  percent(value?: number, fixed = 2) {
    if (!value) return 0
    const result = utilParse.noRoundFixed(value, fixed)

    return `${result}%`
  },
}
