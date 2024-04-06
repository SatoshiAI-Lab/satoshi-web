import { fetchSatoshi } from '..'
import {
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
} from './params'

const walletApi = {
  getWallets(
    params: {
      platform?: string
    } = {
      platform: 'SOL',
    }
  ) {
    return fetchSatoshi.get<UserCreateWalletResp[]>('/api/v1/wallet/', params)
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
      `/api/v1/export-key/${params.wallet_id}`
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
  deleteWallet(params: UserDeleteWalletReq) {
    return fetchSatoshi.delete<UserDeleteWalletResp>(
      `/api/v1/wallet-delete/${params.wallet_id}/`
    )
  },
}

export { walletApi }
