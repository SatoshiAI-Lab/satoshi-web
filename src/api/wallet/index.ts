import { fetchSatoshi } from '..'
import { useStorage } from '@/hooks/use-storage'

import type {
  UserCreateWalletReq,
  UserCreateWalletResp,
  UserImportPrivateKeyReq,
  UserExportPrivateKey,
  UserExportPrivateKeyResp,
  UserImportPrivateKeyResp,
  UserRenameWalletReq,
  UserRenameWalletResp,
  UserDeleteWalletReq,
  UserDeleteWalletResp,
  GetChainsRes,
  GetWalletsRes,
} from './params'

const { getLoginToken } = useStorage()
export const walletApi = {
  getWallets(chain?: string) {
    if (!getLoginToken()) {
      return Promise.reject()
    }
    return fetchSatoshi.get<GetWalletsRes>('/api/v1/wallet/', {
      chain,
    })
  },
  createWallet(params: UserCreateWalletReq) {
    return fetchSatoshi.post<UserCreateWalletResp>('/api/v1/wallet/', params)
  },
  importPrivateKey(params: UserImportPrivateKeyReq) {
    return fetchSatoshi.post<UserImportPrivateKeyResp>(
      '/api/v1/import-key/',
      params
    )
  },
  exportPrivateKey(params: UserExportPrivateKey) {
    return fetchSatoshi.get<UserExportPrivateKeyResp>(
      `/api/v1/export-key/${params.wallet_id}/`
    )
  },
  renameWallet(params: UserRenameWalletReq) {
    return fetchSatoshi.patch<UserRenameWalletResp>(
      `/api/v1/update-wallet-name/${params.wallet_id}/`,
      {
        name: params.name,
      }
    )
  },
  checkName({ id, name }: { id: string; name: string }) {
    return fetchSatoshi.get<{ result: boolean }>(
      `/api/v1/update-wallet-name/${id}/`,
      { name }
    )
  },

  deleteWallet(params: UserDeleteWalletReq) {
    return fetchSatoshi.delete<UserDeleteWalletResp>(
      `/api/v1/wallet-delete/${params.wallet_id}/`
    )
  },

  // Get all supported chains.
  getChains() {
    if (!getLoginToken()) {
      return Promise.reject()
    }
    return fetchSatoshi.get<GetChainsRes>('/api/v1/chain/')
  },

  // Get the balance of a specific wallet.
  getBalance(addr: string, chain?: string) {
    return fetchSatoshi.get<UserCreateWalletResp>(
      `/api/v1/wallet-balance/${addr}/`,
      { chain }
    )
  },
}
