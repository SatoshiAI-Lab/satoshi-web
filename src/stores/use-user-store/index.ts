import { create } from 'zustand'

import { userApi } from '@/api/user'
import { UserEmailVerifyParams } from '@/api/user/params'
import { useStorage } from '@/hooks/use-storage'
import { useTokenRefresh } from '@/hooks/use-token-refresh'
import { walletApi } from '@/api/wallet'
import { WalletPlatform } from '@/api/wallet/params'

import type { States, Actions } from './types'

export const useUserStore = create<States & Actions>((set, get) => ({
  isLogined: false,
  userInfo: undefined,
  setIsLogined: (isLogined) => set({ isLogined }),
  setUserInfo: (userInfo) => set({ userInfo }),
  async login(email, password, showTips = true): Promise<string | void> {
    const { data } = await userApi.login({ email, password })

    const { setLoginToken, setLoginTokenRefresh } = useStorage()
    setLoginToken(data.access!)
    setLoginTokenRefresh(data.refresh!)

    const self = get()
    self.setIsLogined(true)
    await self.fetchUserInfo()

    useTokenRefresh().watch()

    return data.access
  },
  async register(email, verifyCode, password) {
    const self = get()

    await userApi.register({ email, password })

    const data = await self.login(email, password, false)

    await walletApi.createWallet({ platform: WalletPlatform.SOL })

    return data
  },
  async logout() {
    const { setLoginToken, setLoginTokenRefresh } = useStorage()
    const self = get()
    self.setIsLogined(false)
    self.setUserInfo(undefined)
    setLoginToken('')
    setLoginTokenRefresh('')
  },
  async fetchUserInfo() {
    try {
      const token = useStorage().getLoginToken()

      if (!token) return

      const { data } = await userApi.getInfo()

      const self = get()
      self.setUserInfo(data)
      self.setIsLogined(true)
    } catch (e) {
      // Toast Error
      console.log('err', e)
    }
  },
  async sendEmailVerify(
    userEmail: UserEmailVerifyParams
  ): Promise<string | void> {
    return new Promise((resolve, reject) => {
      userApi.sendEmailVerify(userEmail).then((res) => {}).catch
    })
  },
}))
