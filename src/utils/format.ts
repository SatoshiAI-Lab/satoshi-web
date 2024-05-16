import numeral from 'numeral'

import { utilParse } from './parse'
import { utilNum } from './number'
import BigNumber from 'bignumber.js'

/**
 * Utilities functions for formatting
 */
export const utilFmt = {
  fisrtCharUppercase(value?: string) {
    if (typeof value !== 'string') {
      return ''
    }

    return value.slice(0, 1).toUpperCase() + value.slice(1)
  },
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
  token(value?: number | string, fixed = 3) {
    value = Number(value)

    if (!value) return 0

    const strValue = utilNum.transferToNumber(value)

    if (BigNumber(strValue).gte(1) && BigNumber(strValue).lte(10)) {
      return utilParse.noRoundFixed(strValue, fixed)
    }

    if (BigNumber(strValue).gte(10) && BigNumber(strValue).lte(100)) {
      return utilParse.noRoundFixed(strValue, 2)
    }

    if (BigNumber(strValue).gte(100)) {
      return utilParse.noRoundFixed(strValue, 1)
    }

    const decimalIndex = strValue.toString().indexOf('.')
    if (decimalIndex !== -1) {
      const decimalPart = strValue.toString().slice(decimalIndex + 1)
      const zeroLen = decimalPart.match(/^0*/)?.[0].length ?? 0
      const lastNumbers = decimalPart.replace(/^0+/, '')
      const slicedLastNum = lastNumbers.slice(0, fixed)
      const result = `0.0{${zeroLen}}${slicedLastNum}`

      if (zeroLen === 0) return `0.${slicedLastNum}`
      if (zeroLen === 1) return `0.0${slicedLastNum}`
      if (zeroLen === 2) return `0.00${lastNumbers.slice(0, 2)}`
      if (zeroLen === 3) return `0.000${lastNumbers.slice(0, 1)}`

      return result
    } else {
      return numeral(strValue).format('0.00')
    }
  },
  percent(value?: number, fixed = 2) {
    if (!value) return 0
    const result = utilParse.noRoundFixed(value, fixed)

    return `${result}%`
  },
}
