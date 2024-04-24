import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Options {
  enabled?: boolean
  refetchInterval?: false | number
}

export const useWalletList = (options?: Options) => {
  const { enabled = false, refetchInterval = false } = options ?? {}
  const { selectedChain, wallets, allWallets, allWalletList, setWallets, setAllWallets } =
    useWalletStore()

  // Get current wallet list.
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

  // Get all wallet list.
  const getAllWallet = async () => {
    const res = await walletApi.getWallets()

    if (res.data) setAllWallets(res.data)
  }

  // Stored current wallet list.
  useEffect(() => {
    const wallets = walletsData?.data[selectedChain]
    if (isFetched && wallets) setWallets(wallets)
  }, [walletsData, isFetched])

  return {
    wallets,
    allWallets,
    allWalletList,
    isFirstFetchingWallets,
    isFetchingWallets,
    refetchWallets,
    getAllWallet,
  }
}
