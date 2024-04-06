import { utilArr } from './array'

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
} as const
