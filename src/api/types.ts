/** Pagination Params */
export interface PaginationParams {
  page_index?: number
  page_size?: number
}

/** REST Response Error */
export interface ResponseError<T = null> {
  status: number
  message: string
  data: T
}
