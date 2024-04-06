import { create } from 'zustand'

import { userApi } from '@/api/user'
import { UserEmailVerifyParams } from '@/api/user/params'
import { useStorage } from '@/hooks/use-storage'
import { useTokenRefresh } from '@/hooks/use-token-refresh'

import type { States, Actions } from './types'

export const useUserStore = create<States & Actions>((set, get) => ({
  isLogined: false,
  userInfo: undefined,
  setIsLogined: (isLogined) => set({ isLogined }),
  setUserInfo: (userInfo) => set({ userInfo }),
  async login(email, password, showTips = true): Promise<string | void> {
    const { data } = await userApi.login({ email, password })

    const self = get()
    self.setIsLogined(true)
    await self.fetchUserInfo()

    const { setLoginToken, setLoginTokenRefresh } = useStorage()
    setLoginToken(data.access!)
    setLoginTokenRefresh(data.refresh!)

    useTokenRefresh().watch()

    return data.access
  },
  async register(email, verifyCode, password) {
    const self = get()
    await userApi.register({ email, password })
    return await self.login(email, password, false)
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
