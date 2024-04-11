import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'
import { utilArr } from '@/utils/array'

export const useWalletChains = (enabled = false) => {
  const { chains, platforms, setChains, setPlatforms } = useWalletStore()
  const {
    data: chainsData,
    isFetching: isFetchingChains,
    refetch: refetchChains,
  } = useQuery({
    enabled, // Note: disabled by default.
    queryKey: [walletApi.getChains.name],
    queryFn: () => walletApi.getChains(),
  })

  useEffect(() => {
    const chains = chainsData?.data.chains ?? []
    const platforms = chainsData?.data.platforms ?? []

    if (utilArr.isEmpty(chains) || utilArr.isEmpty(platforms)) return
    setChains(chains)
    setPlatforms(platforms)
  }, [chainsData])

  return {
    chains,
    platforms,
    isFetchingChains,
    refetchChains,
  }
}
