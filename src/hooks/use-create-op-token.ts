import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { interactiveApi } from '@/api/interactive'
import { useWaitingStatus } from './use-waiting'

import type { CreateTokenReq } from '@/api/interactive/types'

export const useCreateOpToken = () => {
  const [opHash, setOpHash] = useState('')

  const { isPending: isCreatingOp, mutateAsync: mutateCreate } = useMutation({
    mutationKey: [interactiveApi.createToken.name],
    mutationFn: (params: CreateTokenReq & { id: string }) => {
      const { id, ...req } = params
      return interactiveApi.createToken(id, req)
    },
    onError: (err) => {
      const e = err as unknown as { data: { error: string } }
      toast.error(`[Create Error]: ${e?.data?.error}`)
    },
  })

  const createOpToken = async (
    params: CreateTokenReq & { id: string; total: number }
  ) => {
    const { total, ...req } = params
    const { data } = await mutateCreate({
      ...req,
      amount: total,
    })
    setOpHash(data?.hash_tx)
  }

  const { isLoading: isOpWaiting, isSuccess } = useWaitingStatus({
    hash: opHash,
    onSuccess(data) {
      console.log('create op success', data)
    },
    onError(err) {
      console.log('create op success', err)
    },
  })

  return {
    isOpLoading: isCreatingOp || isOpWaiting,
    isOpSuccess: isSuccess,
    createOpToken,
  }
}
