/** Utilities functions for array */
export const utilArr = {
  isEmpty: <T>(arr: T[]) => arr.length == 0,

  isNotEmpty: <T>(arr: T[]) => !utilArr.isEmpty(arr),

  first: <T>(arr: T[]) => arr[0],

  last: <T>(arr: T[]) => arr[arr.length - 1],
}
