import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useStorage } from './use-storage'
import { utilTime } from '@/utils/time'

interface Options {
  enabled?: boolean
  refetchInterval?: false | number
}

export const useWalletList = (options?: Options) => {
  const { enabled = false, refetchInterval = false } = options ?? {}
  const { selectedChain, wallets, allWallets, setWallets, setAllWallets } =
    useWalletStore()
  const { getLoginToken } = useStorage()

  // Get current wallet list.
  const {
    data: walletsData,
    isLoading: isFirstFetchingWallets,
    isFetching: isFetchingWallets,
    isSuccess,
    refetch: refetchWallets,
  } = useQuery({
    enabled, // By default is disabled.
    refetchInterval,
    queryKey: [walletApi.getWallets.name, selectedChain],
    queryFn: () => walletApi.getWallets(selectedChain),
  })

  // Get all wallet list.
  const getAllWallet = async () => {
    try {
      const res = await walletApi.getWallets()

      if (res.data) {
        setAllWallets(res.data)
      }

      return res
    } catch {
      if (getLoginToken()) {
        await utilTime.wait(2000)
        await getAllWallet()
      }
    } finally {
      useWalletStore.setState({ loadingAllWallet: false })
    }
  }

  // Stored current wallet list.
  useEffect(() => {
    const wallets = walletsData?.data[selectedChain]
    if (isSuccess) setWallets(wallets || [])
  }, [walletsData, isSuccess])

  return {
    wallets,
    allWallets,
    isFirstFetchingWallets,
    isFetchingWallets,
    refetchWallets,
    getAllWallet,
  }
}
