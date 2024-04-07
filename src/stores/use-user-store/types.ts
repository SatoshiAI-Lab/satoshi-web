import { UserEmailVerifyParams } from '@/api/user/params'
import { UserInfoRes } from '@/api/user/responses/getUserInfo'

export interface States {
  isLogined: boolean
  userInfo?: UserInfoRes
}

export interface Actions {
  setIsLogined(isLogined: boolean): void
  setUserInfo(userInfo?: UserInfoRes): void
  fetchUserInfo(): Promise<string | void>
  login(
    userEmail: string,
    userPassword: string,
    showTips?: boolean
  ): Promise<string | void>
  logout(): Promise<void>
  register(
    userEmail: string,
    verifyCode: string,
    userPassword: string
  ): Promise<string | void>
  sendEmailVerify(userEmail: UserEmailVerifyParams): Promise<string | void>
}
