import { create } from 'zustand'

import { userApi } from '@/api/user'
import { UserEmailVerifyParams } from '@/api/user/params'
import { useStorage } from '@/hooks/use-storage'
import { useTokenRefresh } from '@/hooks/use-token-refresh'

import type { States, Actions } from './types'

export const useUserStore = create<States & Actions>((set, get) => ({
  isLogined: false,
  userInfo: '',
  setIsLogined: (isLogined) => set({ isLogined }),
  setUserInfo: (userInfo: string) => set({ userInfo }),
  async login(email, password, showTips = true): Promise<string | void> {
    const { data } = await userApi.login({ email, password })

    const self = get()
    self.setIsLogined(true)
    self.setUserInfo(email)
    self.setToken(data.access!, data.refresh!)

    return data.access
  },
  async register(email, verifyCode, password) {
    const self = get()
    await userApi.register({ email, password })
    return await self.login(email, password, false)
  },
  async setToken(access: string, refresh: string) {
    const { setLoginToken, setLoginTokenRefresh } = useStorage()

    const self = get()
    self.setIsLogined(true)

    setLoginToken(access!)
    setLoginTokenRefresh(refresh!)
    useTokenRefresh().watch()
  },
  async logout() {
    const { setLoginToken } = useStorage()
    const self = get()
    self.setIsLogined(true)
    self.setUserInfo('')
    setLoginToken('')
  },
  async fetchUserInfo() {
    try {
      const { data } = await userApi.getInfo()
      get().setUserInfo(data.email!)
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
