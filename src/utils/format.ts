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
} as const
