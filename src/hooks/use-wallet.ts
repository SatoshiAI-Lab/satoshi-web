import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'
import { UserCreateWalletResp } from '@/api/wallet/params'
import { FetcherResponse } from '@/api/fetcher/types'

interface Options {
  enabled?: boolean
  refetchInterval?: false | number
}

export const useWallet = (options?: Options) => {
  const { enabled = false, refetchInterval = false } = options ?? {}
  const { wallets, allWallets, setAllWallets, selectedChain, setWallets } =
    useWalletStore()
  // Latest created wallet, used for active hints.
  const [latestWallet, setLatestWallet] = useState<(typeof wallets)[number]>()

  const getAllWallet = async () => {
    const allWallet: Promise<FetcherResponse<UserCreateWalletResp[]>>[] = []
    ;['Solana', 'Ethereum', 'Optimism', 'Arbitrum'].forEach((chain) => {
      allWallet.push(walletApi.getWallets(chain))
    })
    const data = await Promise.all(allWallet)
    const ruslt: UserCreateWalletResp[] = []
    data.forEach((item) => {
      ruslt.push(...item.data)
    })
    setAllWallets(ruslt)
    return ruslt
  }

  // Get wallet list.
  const {
    data: walletsData,
    isLoading: isFirstFetchingWallets,
    isFetching: isFetchingWallets,
    isFetched,
    refetch: refetchWallets,
  } = useQuery({
    enabled, // By default is disabled.
    refetchInterval,
    queryKey: [walletApi.getWallets.name, selectedChain],
    queryFn: () => walletApi.getWallets(selectedChain),
  })

  // Create wallet.
  const {
    isPending: isCreating,
    mutateAsync: mutateCreateWallet,
    reset: resetCreateWallet,
  } = useMutation({
    mutationKey: [walletApi.createWallet.name],
    mutationFn: walletApi.createWallet,
  })

  // Remove wallet.
  const {
    isPending: isRemoving,
    mutateAsync: mutateDeleteWallet,
    reset: resetDeleteWallet,
  } = useMutation({
    mutationKey: [walletApi.deleteWallet.name],
    mutationFn: walletApi.deleteWallet,
  })

  // Import wallet.
  const {
    isPending: isImporting,
    mutateAsync: mutateImportPrivateKey,
    reset: resetImportPrivateKey,
  } = useMutation({
    mutationKey: [walletApi.importPrivateKey.name],
    mutationFn: walletApi.importPrivateKey,
  })

  // Export private key.
  const {
    data: privateKey,
    isPending: isExporting,
    mutateAsync: mutateExportPrivateKey,
    reset: resetExportPrivateKey,
  } = useMutation({
    mutationKey: [walletApi.exportPrivateKey.name],
    mutationFn: walletApi.exportPrivateKey,
  })

  // Rename wallet.
  const {
    isPending: isRenaming,
    mutateAsync: mutateRenameWallet,
    reset: resetRenameWallet,
  } = useMutation({
    mutationKey: [walletApi.renameWallet.name],
    mutationFn: walletApi.renameWallet,
  })

  // Create wallet API.
  const createWallet = async (platform: string) => {
    const { data } = await mutateCreateWallet({ platform })

    setLatestWallet(data)
    await refetchWallets()
    resetCreateWallet()
  }

  // Remove wallet API.
  const removeWallet = async (wallet_id: string) => {
    await mutateDeleteWallet({ wallet_id })
    await refetchWallets()
    resetDeleteWallet()
  }

  // Import wallet API.
  const importPrivateKey = async (private_key: string, platform: string) => {
    await mutateImportPrivateKey({ private_key, platform })
    await refetchWallets()
    resetImportPrivateKey()
  }

  // Export wallet API.
  const exportPrivateKey = async (wallet_id: string) => {
    await mutateExportPrivateKey({ wallet_id })
  }

  // Rename wallet API.
  const renameWallet = async (wallet_id: string, name: string) => {
    await mutateRenameWallet({ wallet_id, name })
    await refetchWallets()
    resetRenameWallet()
  }

  // Stored wallet list
  useEffect(() => {
    if (isFetched && walletsData?.data) {
      setWallets(walletsData?.data)
    }
  }, [walletsData, isFetched])

  // Delay clear latest wallet.
  useEffect(() => {
    if (!latestWallet) return

    setTimeout(() => {
      setLatestWallet(undefined)
    }, 4_000)
  }, [latestWallet])

  return {
    wallets,
    privateKey: privateKey?.data.private_key ?? '',
    isFirstFetchingWallets,
    isFetchingWallets,
    isCreating,
    isRemoving,
    isImporting,
    isExporting,
    isRenaming,
    allWallets,
    latestWallet,
    getAllWallet,
    refetchWallets,
    createWallet,
    removeWallet,
    importPrivateKey,
    exportPrivateKey,
    resetExportPrivateKey,
    renameWallet,
  }
}
