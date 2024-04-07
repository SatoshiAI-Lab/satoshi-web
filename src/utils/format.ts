import numeral, { NumeralJSFormat, NumeralJSLocale } from 'numeral'
import { utilArr } from './array'
import { utilParse } from './parse'

/**
 * Utilities functions for formatting
 */
export const utilFmt = {
  /** For Tailwind CSS */
  classes(...args: string[]) {
    if (!args || utilArr.isEmpty(args)) return ''

    return args.map((cls) => cls.trim()).join(' ')
  },
  addr(address?: string) {
    if (address) {
      return `${address.slice(0, 5)}...${address.slice(-5, address.length)}`
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
    if (value > 1) return utilParse.noRoundFixed(value, fixed)

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
      return value.toString()
    }
  },
}
