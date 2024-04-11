import { useQuery } from '@tanstack/react-query'

import { walletApi } from '@/api/wallet'

export const useWalletChains = (enabled = false) => {
  const {
    data: chainsData,
    isFetching: isFetchingChains,
    refetch: refetchChains,
  } = useQuery({
    enabled, // Note: disabled by default.
    queryKey: [walletApi.getChains.name],
    queryFn: () => walletApi.getChains(),
  })

  return {
    chains: chainsData?.data.chains ?? [],
    platforms: chainsData?.data?.platforms ?? [],
    isFetchingChains,
    refetchChains,
  }
}
