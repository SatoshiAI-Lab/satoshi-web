import { AnyObject } from '@/types/types'

interface CategoryArrayOptions {
  /** catogory key */
  key: string
  /** Whether to use a new object each time */
  unique?: boolean
  /** Additional props? add to this object */
  assignProps?: AnyObject
}

type CategoryArrayReturn<R> = [
  AnyObject<R>,
  Map<CategoryArrayOptions['key'], R>
]

/** Utilities functions for array */
export const utilArr = {
  isEmpty: <T>(arr: T[]) => arr.length === 0,

  isNotEmpty: <T>(arr: T[]) => !utilArr.isEmpty(arr),

  first: <T>(arr: (T | undefined)[]) => arr[0],

  last: <T>(arr: (T | undefined)[]) => arr[arr.length - 1],

  remove: <T>(arr: T[], el: T) => arr.filter((e) => e !== el),

  /** Array Whether only one element. */
  onlyOne: <T>(arr: T[]) => arr.length === 1,

  modifyFirst: <T>(arr: T[], el: T) => {
    arr[0] = el
    return arr
  },

  modifyLast: <T>(arr: T[], el: T) => {
    arr[arr.length - 1] = el
    return arr
  },

  sameLen: <T, V>(arr1: T[], arr2: V[]) => arr1.length === arr2.length,

  removeLast: <T>(arr: T[]) => arr.slice(0, -1),

  removeFirst: <T>(arr: T[]) => arr.slice(1),

  /**
   * Categorize an array to Object and Map based on specified key.
   * @param arr origin array
   * @param opts options, see `CategoryArrayOptions`
   * @returns Return an tuple, like: `[Object, Map]`
   */
  categorize<T extends AnyObject[] | undefined>(
    arr: T,
    opts: CategoryArrayOptions
  ): CategoryArrayReturn<T> {
    if (!arr || utilArr.isEmpty(arr)) return [{}, new Map()]

    const { key, assignProps, unique = false } = opts
    const mapResult = arr.reduce<Map<any, any>>((prev, item, i) => {
      Object.assign(item, assignProps)

      if (prev.has(item[key])) {
        prev.get(item[key]).push(item)
      } else {
        prev.set(item[key], [item])
      }

      return prev
    }, new Map())
    const objectResult = Object.fromEntries(mapResult)
    const objResult = unique
      ? JSON.parse(JSON.stringify(objectResult))
      : objectResult

    return [objResult, mapResult]
  },
}
