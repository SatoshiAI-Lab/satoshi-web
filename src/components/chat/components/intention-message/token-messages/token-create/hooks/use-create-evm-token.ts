import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { interactiveApi } from '@/api/interactive'
import { useWaitStatus } from './use-wait-status'

import type { CreateTokenInfo } from '@/components/chat/components/intention-message/token-messages/token-create/types'

export const useCreateEvmToken = (chain?: string) => {
  const [evmHash, setEvmHash] = useState('')
  const [evmAddr, setEvmAddr] = useState('')
  const [isEvmLongTime, setIsEvmLongTime] = useState(false)
  const timerRef = useRef<number>()

  const {
    isPending: isCreating,
    isSuccess: isCreated,
    mutateAsync: mutateCreate,
    reset: resetCreate,
  } = useMutation({
    mutationKey: [interactiveApi.createToken.name],
    mutationFn: interactiveApi.createToken,
    onError: (e: { message: string }) => {
      toast.error(`[Token Create Error]: ${e?.message}`)
    },
  })

  const createEvmToken = async (params: CreateTokenInfo) => {
    const { total, ...req } = params
    const { data } = await mutateCreate({
      ...req,
      amount: total,
    })
    setEvmHash(data?.hash_tx)
    setEvmAddr(data?.address)
  }

  const { isLoading: isWaiting, isSuccess: isCreateSuccess } = useWaitStatus({
    hash: evmHash,
    chain,
    onSuccess(data) {
      console.log('create evm token success', data)
    },
    onError(err) {
      console.log('create evm token success', err)
    },
  })

  const cancelEvm = () => {
    setEvmHash('')
    setEvmAddr('')
    setIsEvmLongTime(false)
    resetCreate()
    clearTimeout(timerRef.current)
  }

  useEffect(() => {
    if (!isCreated) return

    timerRef.current = window.setTimeout(() => {
      setIsEvmLongTime(true)
    }, 10_000)

    return () => {
      setIsEvmLongTime(false)
      clearTimeout(timerRef.current)
    }
  }, [isCreated])

  return {
    evmAddr,
    isEvmLoading: isCreating || isWaiting,
    isEvmSuccess: isCreateSuccess,
    isEvmLongTime: isEvmLongTime,
    createEvmToken,
    cancelEvm,
  }
}
