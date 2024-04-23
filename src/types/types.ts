export type EnumToObject<T extends Record<string, string>> = {
  [k in keyof T]: keyof T
}

export interface AnyObject<T = any> {
  [k: string]: T
}

export type Pair<T = string, V = string> = [T, V]

export enum SortType {
  Asc,
  Desc,
}

export type VoidFn = () => void

// Convert picked required props to partial.
export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
