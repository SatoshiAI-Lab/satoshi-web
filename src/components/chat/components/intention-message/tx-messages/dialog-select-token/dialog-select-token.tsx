import { DialogHeader } from '@/components/dialog-header'
import { Platform } from '@/config/wallet'
import {
  Button,
  CircularProgress,
  Dialog,
  MenuItem,
  Select,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { TokenList } from './token-list'
import { ChainList } from './chain-list'
import { SearchInput } from './search-input'
import {
  DialogContext,
  useDialogSelectTokenContext,
} from '@/hooks/use-swap/use-dialog-select-token'
import { useWalletManage } from '@/hooks/use-wallet'
import { useWalletList } from '@/hooks/use-wallet-list'
import { useEffect, useState } from 'react'
import { UserCreateWalletResp } from '@/api/wallet/params'

interface Props {
  isFrom: boolean
  show: boolean
  open: () => any
  hidden: () => any
}

export const DialogSelectToken = (props: Props) => {
  const { show, isFrom, hidden } = props
  const { t } = useTranslation()

  const [createdWallet, setCreatedWallet] = useState('')
  const [createWalletLoading, setCraeteWalletLoading] = useState(false)

  const { createWallet } = useWalletManage()
  const { getAllWallet } = useWalletList()
  
  const {
    loadingSearch,
    searchTokens,
    selectWallet,
    walletPlatform,
    contextValue,
    searchValue,
    isSearch,
    createWalletInfo,
    selectChainId,
    setCreateWalletInfo,
    setSelectWallet,
    setSelectChainId,
  } = useDialogSelectTokenContext(isFrom)

  const handleSwitchWallet = (wallet: UserCreateWalletResp) => {
    setSelectWallet(wallet)
    setSelectChainId('-1')
  }

  useEffect(() => {
    if (createdWallet) {
      setCreatedWallet('')
    }
    if (createWalletInfo) {
      setCreateWalletInfo(undefined)
    }
  }, [searchValue])


  const dialogContent = () => {
    // 查币中
    if (loadingSearch) {
      return (
        <div className="h-[300px] flex flex-col items-center justify-center">
          <CircularProgress />
          <span className="text-gray-400 mt-6">{t('searching.tokens')}</span>
        </div>
      )
    }

    // 没找到对应的代币
    if (searchTokens.length == 0 && searchValue.trim()) {
      return (
        <div className="mt-5 flex flex-col items-center justify-center">
          <img
            src="/images/empty-token.png"
            className="w-[150px] h-[150px]"
            alt="empty"
          />
          <div className="mt-2 text-gray-500">
            {t('not.find.token1')}
            <span className="font-bold"> {searchValue} </span>
            {t('not.find.token2')}
          </div>
        </div>
      )
    }

    // 提示创建钱包
    if (createWalletInfo?.actived) {
      const onCreateWallet = async () => {
        try {
          setCraeteWalletLoading(true)
          await createWallet(createWalletInfo.platform)
          await getAllWallet()
          setCreateWalletInfo(undefined)
          setCreatedWallet(createWalletInfo.chainName)
        } catch {
        } finally {
          setCraeteWalletLoading(false)
        }
      }
      return (
        <div className="flex flex-col justify-center items-center">
          <img
            src="/images/chain-logo/Solana.png"
            alt="Solana"
            className="w-[80px] h-[80px] mt-5"
          />
          <div className="my-4 max-w-[250px]">
            {t('create.wallet.token')
              .replace('$1', createWalletInfo.tokenName)
              .replaceAll('$2', createWalletInfo.chainName)}
          </div>
          <div>
            <Button
              variant="contained"
              className="!rounded-full"
              onClick={onCreateWallet}
              disabled={createWalletLoading}
            >
              {createWalletLoading ? (
                <CircularProgress size={20} className="mr-2" />
              ) : null}
              {t('create.wallet').replace('$1', createWalletInfo.chainName)}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <>
        {!isSearch && (
          <div className="px-6 flex items-center">
            <span className="text-base mr-2">
              {isSearch ? t('use.wallet') : t('my.tokens.in')}
            </span>
            <Select value={selectWallet?.address} size="small">
              {Object.keys(walletPlatform!).map((platform) => {
                return walletPlatform![platform as Platform]?.map((wallet) => {
                  return (
                    <MenuItem
                      key={wallet.address}
                      value={wallet.address}
                      onClick={() => handleSwitchWallet(wallet)}
                    >
                      <span className="mr-5">{wallet.name}</span>
                      <span className="text-gray-400">{wallet.platform}</span>
                    </MenuItem>
                  )
                })
              })}
            </Select>
          </div>
        )}
        <ChainList />
        <TokenList />
        {createdWallet !== '' ? (
          <div className="w-max mx-auto pt-2 mb-5 text-gray-400">
            <div>{t('created.wallet.tips1').replace('$1', createdWallet)}</div>
            <div>{t('created.wallet.tips2')}</div>
          </div>
        ) : null}
      </>
    )
  }

  return (
    <DialogContext.Provider value={{ ...contextValue, closeDialog: hidden }}>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader
          text={<span className="text-lg">{t('select.a.token')}</span>}
          onClose={hidden}
          textAlign="left"
        ></DialogHeader>
        <div className="min-w-[420px] h-[500px]">
          <SearchInput isFrom={isFrom} />
          <div className="mt-4 pt-2 border-t border-gray-300">
            {dialogContent()}
          </div>
        </div>
      </Dialog>
    </DialogContext.Provider>
  )
}
