interface UseRandomOps {
  repeatable?: boolean
  floor?: boolean
}

/**
 * Generate random number, or random select from an array.
 * @param maxOrArray max number, or an array.
 *
 * if array, will be random select from array,
 *
 * if number, will be random number between 0 and max.
 *
 * @default 10
 * @return Return a generator function.
 */
export const useRandom = <T>(max: number | T[] = 10, ops?: UseRandomOps) => {
  const { repeatable = false, floor = true } = ops ?? {}
  let lastRandom: number

  const isFloor = (n: number) => (floor ? Math.floor(n) : n)

  /*** If you need, you can use a new max number to override old max number. */
  return (newMax?: number) => {
    const maxLen = (
      newMax ?? typeof max === 'number' ? max : max.length
    ) as number
    let rd = Math.random() * maxLen

    while (!repeatable && rd === lastRandom) {
      rd = Math.random() * maxLen
    }

    lastRandom = rd

    // if array, random select.
    if (Array.isArray(max)) {
      return max[isFloor(rd)] as T
    }

    return isFloor(rd) as T
  }
}
