import { ChainInfo, MultiChainCoin } from '@/api/chat/types'
import { DialogHeader } from '@/components/dialog-header'
import { Platform } from '@/config/wallet'
import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { useWalletStore } from '@/stores/use-wallet-store'
import {
  CircularProgress,
  Dialog,
  MenuItem,
  Select,
} from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TokenList } from './token-list'
import { ChainList } from './chain-list'
import { SearchInput } from './search-input'

interface Props {
  isFrom: boolean
  show: boolean
  open: () => any
  hidden: () => any
}

export const DialogSelectToken = (props: Props) => {
  const { show, isFrom, hidden } = props
  const { t } = useTranslation()

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

  const selectWallet = walletPlatform[currentWallet!.platform!]?.find(
    (w) => w.address === currentWallet?.address
  )

  const tokens = searchValue != '' ? searchTokens : selectWallet?.tokens

  // .filter((t) => t.value_usd > 1)

  const tokenChainRaw = tokens?.map((t) => t.chain) || []

  const tokenChain: ChainInfo[] = []
  for (const token of tokenChainRaw) {
    if (!tokenChain.find((chian) => chian.id == token.id)) {
      tokenChain.push(token)
    }
  }

  return (
    <Dialog open={show} onClose={hidden}>
      <DialogHeader
        text={<span className="text-lg">{t('select.a.token')}</span>}
        onClose={hidden}
        textAlign="left"
      ></DialogHeader>
      <div className="min-w-[400px] min-h-[450px]">
        <SearchInput
          isFrom={isFrom}
          selectWalletTokens={selectWallet?.tokens}
          searchValue={searchValue}
          setIsNameSearch={setIsNameSearch}
          setSearchValue={setSearchValue}
          setSearchTokens={setSearchTokens}
          setLoadingSearch={setLoadingSearch}
        />
        <div className="mt-4 pt-2 border-t border-gray-300">
          {loadingSearch ? (
            <div className="h-[300px] flex flex-col items-center justify-center">
              <CircularProgress />
              <span className="text-gray-400 mt-6">
                {t('searching.tokens')}
              </span>
            </div>
          ) : (
            <>
              <div className="px-6 flex items-center">
                <span className="text-base mr-2">{t('my.tokens.in')}</span>
                <Select value={selectWallet?.address} size="small">
                  {Object.keys(walletPlatform).map((platform) => {
                    return walletPlatform[platform as Platform]?.map(
                      (wallet) => {
                        return (
                          <MenuItem key={wallet.address} value={wallet.address}>
                            <span className="mr-5">{wallet.name}</span>
                            <span className="text-gray-400">
                              {wallet.platform}
                            </span>
                          </MenuItem>
                        )
                      }
                    )
                  })}
                </Select>
              </div>

              <ChainList
                selectChainId={selectChainId}
                setSelectChainId={setSelectChainId}
                tokenChain={tokenChain}
              />
              <TokenList
                selectChainId={selectChainId}
                searchTokens={searchTokens}
                searchValue={searchValue}
                selectWalletTokens={tokens}
                isNameSearch={isNameSearch}
              />
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}
