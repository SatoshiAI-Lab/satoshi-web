import { UserEmailVerifyParams } from '@/api/user/params'

export interface States {
  isLogined: boolean
  userInfo: string
}

export interface Actions {
  setIsLogined(isLogined: boolean): void
  setUserInfo(userInfo: string): void
  fetchUserInfo(): Promise<string | void>
  login(
    userEmail: string,
    userPassword: string,
    showTips?: boolean
  ): Promise<string | void>
  logout(): Promise<void>
  setToken(access: string, refresh: string): void
  register(
    userEmail: string,
    verifyCode: string,
    userPassword: string
  ): Promise<string | void>
  sendEmailVerify(userEmail: UserEmailVerifyParams): Promise<string | void>
}
