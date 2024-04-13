import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { interactiveApi } from '@/api/interactive'
import { useWaitingStatus } from './use-waiting'

import type { CreateTokenInfo } from '@/components/chat/components/bubbles/create-token-bubble/types'

export const useCreateOpToken = (chain?: string) => {
  const [opHash, setOpHash] = useState('')
  const [opAddr, setOpAddr] = useState('')
  const [isOpLongTime, setIsOpLongTime] = useState(false)
  const timerRef = useRef<number>()

  const {
    isPending: isCreating,
    isSuccess: isCreated,
    mutateAsync: mutateCreate,
    reset: resetCreate,
  } = useMutation({
    mutationKey: [interactiveApi.createToken.name],
    mutationFn: interactiveApi.createToken,
    onError: (err) => {
      const e = err as unknown as { data: { error: string } }
      toast.error(`[Create Error]: ${e?.data?.error}`)
    },
  })

  const createOpToken = async (params: CreateTokenInfo) => {
    const { total, ...req } = params
    const { data } = await mutateCreate({
      ...req,
      amount: total,
    })
    setOpHash(data?.hash_tx)
    setOpAddr(data?.address)
  }

  const { isLoading: isWaiting, isSuccess: isCreateSuccess } = useWaitingStatus(
    {
      hash: opHash,
      chain,
      onSuccess(data) {
        console.log('create op success', data)
      },
      onError(err) {
        console.log('create op success', err)
      },
    }
  )

  const cancelOp = () => {
    setOpHash('')
    setOpAddr('')
    setIsOpLongTime(false)
    resetCreate()
    clearTimeout(timerRef.current)
  }

  useEffect(() => {
    if (!isCreated) return

    timerRef.current = window.setTimeout(() => {
      setIsOpLongTime(true)
    }, 10_000)

    return () => {
      setIsOpLongTime(false)
      clearTimeout(timerRef.current)
    }
  }, [isCreated])

  return {
    opAddr,
    isOpLoading: isCreating || isWaiting,
    isOpSuccess: isCreateSuccess,
    isOpLongTime,
    createOpToken,
    cancelOp,
  }
}
