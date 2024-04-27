import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  type GetHashStatusRes,
  TokenCreateStatus,
} from './../api/interactive/types'

import { interactiveApi } from '@/api/interactive'

interface UseWaitingOptions {
  hash?: string
  chain?: string
  onSuccess?: (data: GetHashStatusRes | undefined) => void
  onError?: (reason: string) => void
}

export const useWaitingStatus = (options: UseWaitingOptions) => {
  const { hash = '', chain = '', onError, onSuccess } = options
  const [enabled, setEnabled] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const { data } = useQuery({
    enabled,
    refetchInterval: 3_000,
    queryKey: [interactiveApi.getHashStatus.name, hash, chain],
    queryFn: () => {
      setIsLoading(true)
      return interactiveApi.getHashStatus({ hash_tx: hash, chain })
    },
  })
  const status = data?.data.status

  const clear = () => {
    setIsSuccess(false)
    setIsError(false)
    setIsLoading(false)
    setIsComplete(false)
    // setEnabled(false)
  }

  useEffect(() => {
    if (isComplete) {
      setEnabled(false)
      return
    }

    setEnabled(!!hash)
  }, [hash])

  useEffect(() => {
    if (!status) return

    setIsLoading(false)
    setIsComplete(true)

    if (
      status === TokenCreateStatus.Timeout ||
      status === TokenCreateStatus.Failed
    ) {
      setEnabled(false)
      setIsError(true)
      onError?.(status === TokenCreateStatus.Timeout ? 'Timeout' : 'Failed')
      return
    }

    if (status === TokenCreateStatus.Success) {
      setEnabled(false)
      setIsSuccess(true)
      onSuccess?.(data?.data)
      return
    }
  }, [status])

  return { data, isSuccess, isError, isLoading, clear }
}
