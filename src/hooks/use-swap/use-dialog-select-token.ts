import { MultiChainCoin, ChainInfo } from '@/api/chat/types'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
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
  selectChainId?: string
  setSelectChainId: (v: string) => void
  tokenChain: ChainInfo[]
  selectWallet?: UserCreateWalletResp
  walletPlatform?: WalletPlatform
  isSearch: boolean
  isFrom: boolean
  createWalletInfo?: CreatewalletInfo
  setCreateWalletInfo: (v: CreatewalletInfo) => void
  selectSearchToken?: MultiChainCoin
  setSelectSearchToken: (v: MultiChainCoin) => void
  setSelectWallet: (v?: UserCreateWalletResp) => void
  closeDialog: () => any
}

export const DialogContext = createContext<DialogContextType>({
  selectToToken: undefined,
  searchValue: '',
  setSearchValue: () => {},
  loadingSearch: false,
  setLoadingSearch: () => {},
  searchTokens: [],
  setSearchTokens: () => {},
  isNameSearch: false,
  setIsNameSearch: () => {},
  selectChainId: '-1',
  setSelectChainId: () => {},
  tokenChain: [],
  selectWallet: undefined,
  walletPlatform: undefined,
  isSearch: false,
  isFrom: false,
  selectSearchToken: undefined,
  setSelectSearchToken: () => {},
  createWalletInfo: undefined,
  setCreateWalletInfo: (v: {
    tokenName: string
    chainName: string
    platform: string
    actived: boolean
  }) => {},
  setSelectWallet: () => {},
  closeDialog: () => {},
})

export const useDialogSelectTokenContext = (isFrom: boolean) => {
  const { currentWallet, selectFromToken, selectToToken } =
    useContext(SwapContext)

  const { walletPlatform } = useWalletStore()

  const [searchValue, setSearchValue] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [searchTokens, setSearchTokens] = useState<MultiChainCoin[]>([])
  const [isNameSearch, setIsNameSearch] = useState(false)
  const [selectSearchToken, setSelectSearchToken] = useState<MultiChainCoin>()
  const [createWalletInfo, setCreateWalletInfo] = useState<CreatewalletInfo>()
  const [selectWallet, setSelectWallet] = useState<UserCreateWalletResp>()
  const [selectChainId, setSelectChainId] = useState<string>()

  const tokens = searchValue !== '' ? searchTokens : selectWallet?.tokens
  const tokenChainRaw = tokens?.map((t) => t.chain) || []

  const tokenChain: ChainInfo[] = []
  for (const token of tokenChainRaw) {
    if (!tokenChain.find((chian) => chian.id == token.id)) {
      tokenChain.push(token)
    }
  }

  useEffect(() => {
    if (currentWallet) {
      const wallelt = walletPlatform[currentWallet?.platform!]?.find(
        (w) => w.address === currentWallet?.address
      )
      setSelectWallet(wallelt)
    }
  }, [currentWallet])

  useEffect(() => {
    const selectToken = isFrom ? selectToToken : selectFromToken
    if (selectToken && !selectChainId) {
      setSelectChainId(selectToken.chain.id)
    }
  }, [selectToToken, selectFromToken])

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
    selectSearchToken,
    setSelectSearchToken,
    setSelectWallet,
  }

  return { ...contextValue, contextValue }
}