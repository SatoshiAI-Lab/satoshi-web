export interface UserLoginParams {
  email?: string
  password?: string
}

export interface UserRegisterRes {
  email: string
  id: string
}

export interface TokenId {
  id: number
  type: number
}

export interface UserEmailVerifyParams {
  email: string
  status?: number
}

export interface UserSmsVerifyParams {
  mobile: string
  status?: number
}
export interface UserForgotPwd
  extends UserEmailVerifyParams,
    UserSmsVerifyParams {
  password: string
  verify_code: string
}

export interface UserUpdateInfoParams {
  username?: string
  avatar?: string
  intro?: string
  address?: string
}

export interface UserBindMobileOrEmail {
  verify_code: string
  mobile?: string
  email?: string
}

export interface UserUnreadMsgParams {}
