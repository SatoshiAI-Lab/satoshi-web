import { UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'
import { utilArr } from '@/utils/array'

import type { WalletPlatform } from '@/api/wallet/params'

interface Options {
  enabled?: boolean
  refetchInterval?: false | number
}

export const useWallet = (options?: Options) => {
  const { enabled = false, refetchInterval = false } = options ?? {}
  const { wallets, selectedChain, setWallets } = useWalletStore()

  // Get wallet list.
  const {
    data: walletsData,
    isLoading: isFirstFetchingWallets,
    isFetching: isFetchingWallets,
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

  const {
    isPending: isRenaming,
    mutateAsync: mutateRenameWallet,
    reset: resetRenameWallet,
  } = useMutation({
    mutationKey: [walletApi.renameWallet.name],
    mutationFn: walletApi.renameWallet,
  })

  // Create wallet API.
  const createWallet = async (platform: WalletPlatform) => {
    await mutateCreateWallet({ platform })
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
  const importPrivateKey = async (
    private_key: string,
    platform: WalletPlatform
  ) => {
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
    if (utilArr.isEmpty(walletsData?.data ?? [])) return

    setWallets(walletsData?.data ?? [])
  }, [walletsData])

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
    refetchWallets,
    createWallet,
    removeWallet,
    importPrivateKey,
    exportPrivateKey,
    resetExportPrivateKey,
    renameWallet,
  }
}
