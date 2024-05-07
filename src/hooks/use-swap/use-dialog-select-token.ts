import { MultiChainCoin, ChainInfo } from '@/api/chat/types'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { SwapContext } from './use-swap-provider'
import { WalletPlatform, useWalletStore } from '@/stores/use-wallet-store'
import { UserCreateWalletResp } from '@/api/wallet/params'
import { Platform } from '@/config/wallet'

interface CreatewalletInfo {
  tokenName: string
  chainName: string
  platform: Platform
  actived: boolean
}

interface DialogContextType {
  selectToToken: MultiChainCoin | undefined
  searchValue: string
  setSearchValue: (v: string) => void
  loadingSearch: boolean
  setLoadingSearch: (v: boolean) => void
  searchTokens: MultiChainCoin[]
  setSearchTokens: (v: MultiChainCoin[]) => void
  isNameSearch: boolean
  setIsNameSearch: (v: boolean) => void
  selectChainId: string
  setSelectChainId: (v: string) => void
  tokenChain: ChainInfo[]
  selectWallet?: UserCreateWalletResp
  walletPlatform?: WalletPlatform
  isSearch: boolean
  isFrom: boolean
  createWalletInfo?: CreatewalletInfo
  setCreateWalletInfo: (v: CreatewalletInfo) => void
}

export const DialogContext = createContext<DialogContextType>({
  selectToToken: undefined,
  searchValue: '',
  setSearchValue: (v: string) => {},
  loadingSearch: false,
  setLoadingSearch: (value: boolean) => {},
  searchTokens: [],
  setSearchTokens: (value: MultiChainCoin[]) => {},
  isNameSearch: false,
  setIsNameSearch: (value: boolean) => {},
  selectChainId: '',
  setSelectChainId: (value: string) => {},
  tokenChain: [],
  selectWallet: undefined,
  walletPlatform: undefined,
  isSearch: false,
  isFrom: false,
  createWalletInfo: {
    tokenName: 'PYTH',
    chainName: 'Solana',
    platform: Platform.Sol,
    actived: true,
  },
  setCreateWalletInfo: (v: {
    tokenName: string
    chainName: string
    platform: string
    actived: boolean
  }) => {},
})

export const useDialogSelectTokenContext = (isFrom: boolean) => {
  const { currentWallet, selectFromToken, selectToToken } =
    useContext(SwapContext)

  const { walletPlatform } = useWalletStore()

  const [searchValue, setSearchValue] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [searchTokens, setSearchTokens] = useState<MultiChainCoin[]>([])
  const [isNameSearch, setIsNameSearch] = useState(false)
  const [selectChainId, setSelectChainId] = useState(
    selectFromToken?.chain.id || '-1'
  )
  const [createWalletInfo, setCreateWalletInfo] = useState<
    CreatewalletInfo | undefined
  >({
    tokenName: 'PYTH',
    chainName: 'Solana',
    platform: Platform.Sol,
    actived: true,
  })

  const selectWallet = walletPlatform[currentWallet?.platform!]?.find(
    (w) => w.address === currentWallet?.address
  )

  const tokens = searchValue !== '' ? searchTokens : selectWallet?.tokens
  const tokenChainRaw = tokens?.map((t) => t.chain) || []

  const tokenChain: ChainInfo[] = []
  for (const token of tokenChainRaw) {
    if (!tokenChain.find((chian) => chian.id == token.id)) {
      tokenChain.push(token)
    }
  }

  const contextValue = {
    isNameSearch,
    setIsNameSearch,
    selectChainId,
    setSelectChainId,
    tokenChain,
    searchValue,
    setSearchValue,
    loadingSearch,
    setLoadingSearch,
    searchTokens,
    setSearchTokens,
    selectToToken,
    selectWallet,
    walletPlatform,
    isSearch: searchValue.trim() !== '',
    isFrom,
    createWalletInfo,
    setCreateWalletInfo,
  }

  return { ...contextValue, contextValue }
}
