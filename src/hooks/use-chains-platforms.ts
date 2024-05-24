import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { walletApi } from '@/api/wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

export const useChainsPlatforms = (enabled = false) => {
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

  const getPlatformByChain = (chianName: string) => {
    return chains.find((c) => c.name === chianName)?.platform
  }

  // If you need, handle default select here.
  // const defaultSelect = () => {}

  useEffect(() => {
    const chains = chainsData?.data.chains ?? []
    const platforms = chainsData?.data.platforms ?? []

    setChains(chains)
    setPlatforms(platforms)
    // defaultSelect()
  }, [chainsData])

  return {
    chains,
    platforms,
    isFetchingChains,
    getPlatformByChain,
    refetchChains,
  }
}
