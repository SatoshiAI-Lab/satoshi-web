import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { interactiveApi } from '@/api/interactive'

import { CreateTokenReq, MintTokenReq } from '@/api/interactive/types'
import { useWaitingStatus } from './use-waiting'

export const useCreateToken = () => {
  const [total, setTotal] = useState(-1)
  const [walletId, setWalletId] = useState('')
  const [createdHash, setCreatedHash] = useState('')
  const [mintHash, setMintHash] = useState('')

  // Create token.
  const {
    data: createdToken,
    isPending: isCreating,
    mutateAsync: createTokenAsync,
  } = useMutation({
    mutationKey: [interactiveApi.createToken.name],
    mutationFn: (params: CreateTokenReq & { id: string }) => {
      const { id, ...req } = params
      return interactiveApi.createToken(id, req)
    },
    onError: (e) => toast.error(`[Create Error]: ${e}`),
  })

  // Mint token.
  const {
    data: mintedToken,
    isPending: isMinting,
    mutateAsync: mintTokenAsync,
  } = useMutation({
    mutationKey: [interactiveApi.mintToken.name],
    mutationFn: (params: MintTokenReq & { id: string }) => {
      const { id, ...req } = params

      return interactiveApi.mintToken(id, req)
    },
    onError: (e) => toast.error(`[Mint Error]: ${e}`),
  })

  // Waiting for create token.
  const {
    isLoading: isCreatingStatus,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useWaitingStatus({
    hash: createdHash,
    onSuccess: async (data) => {
      toast.success('Create success, minting...')

      const created_hash = createdToken?.data.hash_tx
      console.log('create success', data, created_hash)
      if (!created_hash) {
        console.log('mint error', created_hash)
        return
      }

      const { data: mintData } = await mintTokenAsync({
        id: walletId,
        amount: total,
        created_hash,
      })

      setMintHash(mintData.hash_tx)
    },
    onError(reason) {
      console.log('create error', reason)
      toast.error(`Create ${reason}`)
    },
  })

  // Waiting for mint token.
  const {
    isLoading: isMintingStatus,
    isSuccess: isMintSuccess,
    isError: isMintError,
    clear,
  } = useWaitingStatus({
    hash: mintHash,
    onSuccess(data) {
      console.log('mint success', data)
    },
    onError(reason) {
      console.log('mint error', reason)
      toast.error(`Mint ${reason}`)
    },
  })

  const createToken = async (
    params: CreateTokenReq & { id: string; total: number }
  ) => {
    console.log('createToken', params)
    try {
      const { data } = await createTokenAsync(params)

      console.log('createToken after', data)

      setCreatedHash(data.hash_tx)
      setWalletId(params.id)
      setTotal(params.total)
    } catch (error) {
      console.error('createToken error', error)
      toast.error('createToken error')
    }
  }

  const mintToken = async () => {
    try {
      const { data } = await mintTokenAsync({
        id: walletId,
        amount: total,
        created_hash: createdHash,
      })
      setMintHash(data.hash_tx)
    } catch (error) {
      console.error('mintToken error', error)
      toast.error('mintToken error')
    }
  }

  const cancel = () => {
    console.log('cancel')
    setCreatedHash('')
    setMintHash('')
    setTotal(-1)
    setWalletId('')
    clear()
  }

  const timerRef = useRef<number>()
  const [isLongTime, setIsLongTime] = useState(false)

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setIsLongTime(true)
    }, 20 * 1000)

    return () => {
      setIsLongTime(false)
      clearTimeout(timerRef.current)
    }
  }, [isCreateSuccess, isMintSuccess])

  return {
    isLongTime,
    isMinting: isMinting || isMintingStatus,
    isLoading: isCreating || isMinting || isCreatingStatus || isMintingStatus,
    isCreateSuccess,
    isMintSuccess,
    isMintError,
    address: mintedToken?.data.address ?? '',
    hash: mintedToken?.data.hash_tx ?? '',
    createToken,
    mintToken,
    cancel,
  }
}
