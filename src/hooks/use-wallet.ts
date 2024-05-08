import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type { PartialWalletRes } from '@/stores/use-wallet-store'

import { walletApi } from '@/api/wallet'
import { useWalletList } from './use-wallet-list'
import { Platform } from '@/config/wallet'

export const useWalletManage = () => {
  // Latest created wallet, used for active hints.
  const [latestWallet, setLatestWallet] = useState<PartialWalletRes>()
  const { refetchWallets } = useWalletList()

  // Create wallet.
  const {
    isPending: isCreating,
    isError: isCreateError,
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

  const {
    isPending: isCheckingName,
    mutateAsync: checkName,
    reset: resetCheckName,
  } = useMutation({
    mutationKey: [walletApi.checkName.name],
    mutationFn: walletApi.checkName,
  })

  // Create wallet API.
  const createWallet = async (platform: Platform) => {
    const { data } = await mutateCreateWallet({ platform })

    setLatestWallet(data)
    await refetchWallets()
    resetCreateWallet()
    return data
  }

  // Remove wallet API.
  const removeWallet = async (wallet_id: string) => {
    await mutateDeleteWallet({ wallet_id })
    await refetchWallets()
    resetDeleteWallet()
  }

  // Import wallet API.
  const importPrivateKey = async (private_key: string, platform: Platform) => {
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

  // Delay clear latest wallet.
  useEffect(() => {
    if (!latestWallet) return

    setTimeout(() => {
      setLatestWallet(undefined)
    }, 4_000)
  }, [latestWallet])

  return {
    privateKey: privateKey?.data.private_key ?? '',
    isCreating,
    isCreateError,
    isRemoving,
    isImporting,
    isExporting,
    isRenaming,
    isCheckingName,
    latestWallet,
    refetchWallets,
    createWallet,
    removeWallet,
    importPrivateKey,
    exportPrivateKey,
    resetExportPrivateKey,
    renameWallet,
    checkName,
    resetCheckName,
  }
}
