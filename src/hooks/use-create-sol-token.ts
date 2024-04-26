import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { interactiveApi } from '@/api/interactive'
import { useWaitingStatus } from './use-waiting'

import type { CreateTokenInfo } from '@/components/chat/components/intention-message/token-messages/create-token/types'

export const useCreateSolToken = () => {
  const [total, setTotal] = useState(-1)
  const [walletId, setWalletId] = useState('')
  const [createdHash, setCreatedHash] = useState('')
  const [mintHash, setMintHash] = useState('')
  const [isSolLongTime, setIsSolLongTime] = useState(false)
  const timerRef = useRef<number>()

  // Create token.
  const {
    data: createdToken,
    isPending: isCreating,
    mutateAsync: createTokenAsync,
    reset: resetCreateToken,
  } = useMutation({
    mutationKey: [interactiveApi.createToken.name],
    mutationFn: interactiveApi.createToken,
    onError: (e) => toast.error(`[Create Error]: ${e}`),
  })

  // Mint token.
  const {
    data: mintedToken,
    isPending: isMinting,
    mutateAsync: mintTokenAsync,
    reset: resetMintToken,
  } = useMutation({
    mutationKey: [interactiveApi.mintToken.name],
    mutationFn: interactiveApi.mintToken,
    onError: (e) => toast.error(`[Mint Error]: ${e}`),
  })

  // Waiting for create token.
  const {
    isLoading: isWaitingCreateStatus,
    isSuccess: isSolCreateSuccess,
    isError: isCreateError,
    clear: clearCreate,
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
    isLoading: isWaitingMintStatus,
    isSuccess: isSolMintSuccess,
    isError: isSolMintError,
    clear: clearMint,
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

  const createSolToken = async (params: CreateTokenInfo) => {
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

  const mintSolToken = async () => {
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

  const cancelSol = () => {
    console.log('cancel')
    setCreatedHash('')
    setMintHash('')
    setTotal(-1)
    setWalletId('')
    clearCreate()
    clearMint()
    resetCreateToken()
    resetMintToken()
  }

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setIsSolLongTime(true)
    }, 10_000)

    return () => {
      setIsSolLongTime(false)
      clearTimeout(timerRef.current)
    }
  }, [isSolCreateSuccess, isSolMintSuccess])

  return {
    isSolLongTime,
    isSolMinting: isMinting || isWaitingMintStatus,
    isSolLoading:
      isCreating || isMinting || isWaitingCreateStatus || isWaitingMintStatus,
    isSolCreateSuccess,
    isSolMintSuccess,
    isSolMintError,
    solAddr: mintedToken?.data.address ?? '',
    solHash: mintedToken?.data.hash_tx ?? '',
    createSolToken,
    mintSolToken,
    cancelSol,
  }
}
