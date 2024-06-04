import { Dispatch, SetStateAction, useState } from 'react'
import { useWalletManage } from '../use-wallet'
import { useWalletList } from '../use-wallet-list'
import { CreatewalletInfo } from './use-dialog-select-token'
import { Platform } from '@/config/wallet'

export const useCreateWallet = () => {
  const [createdWallet, setCreatedWallet] = useState('')
  const [createWalletLoading, setCraeteWalletLoading] = useState(false)
  const [createWalletInfo, setCreateWalletInfo] = useState<CreatewalletInfo>()
  const { getAllWallet } = useWalletList()

  const { createWallet } = useWalletManage()
  const onCreateWallet = async (platform?: Platform) => {
    try {
      setCraeteWalletLoading(true)
      await createWallet(platform || createWalletInfo?.platform!)
      await getAllWallet()
      setCreateWalletInfo(undefined)
      setCreatedWallet(createWalletInfo?.chainName!)
    } catch {
    } finally {
      setCraeteWalletLoading(false)
    }
  }

  return {
    createdWallet,
    createWalletLoading,
    createWalletInfo,
    setCreateWalletInfo,
    setCreatedWallet,
    onCreateWallet,
  }
}
