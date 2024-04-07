import { fetchSatoshi } from '../'
import type {
  UserBindMobileOrEmail,
  UserEmailVerifyParams,
  UserForgotPwd,
  UserLoginParams,
  UserRegisterRes,
  UserSmsVerifyParams,
  UserUnreadMsgParams,
  UserUpdateInfoParams,
} from './params'
import type { LoginRes } from './responses/login'
import type { UserInfoRes } from './responses/getUserInfo'

export const userApi = {
  /** user sign up */
  register(params: UserLoginParams) {
    return fetchSatoshi.post<UserRegisterRes>('/api/v1/register/', params)
  },
  /** get user info */
  getInfo() {
    return fetchSatoshi.get<UserInfoRes>('/api/v1/mine/')
  },
  /** user sign in */
  login(params: UserLoginParams) {
    return fetchSatoshi.post<LoginRes>('/api/v1/token/', params)
  },
  /** refresh token */
  refresh(refresh: string) {
    return fetchSatoshi.post<LoginRes>('/api/v1/token/refresh/', { refresh })
  },

  /** forgot password */
  forgotPwd(params: UserForgotPwd) {
    return fetchSatoshi.post('/user/password', params)
  },
  /** get user id */
  getId() {
    return fetchSatoshi.get('/user/id')
  },
  /** update user info */
  updateInfo(params: UserUpdateInfoParams) {
    return fetchSatoshi.put('/user', params)
  },
  /** bind user mobile */
  bindMobile(params: UserBindMobileOrEmail) {
    return fetchSatoshi.post('/user/bind/mobileoremail', params)
  },
  /** bind inviter */
  bindInviter(code: string) {
    return fetchSatoshi.post('/user/bind', { code })
  },
  /** unread message alert */
  unreadMsg(params: Partial<UserUnreadMsgParams>) {
    return fetchSatoshi.get('/user/latest/view', params)
  },
  /** new message push */
  newMsgPush(cid: string) {
    return fetchSatoshi.get('/user/latest/push', { cid })
  },
  /** send email verify code */
  sendEmailVerify(params: UserEmailVerifyParams) {
    return fetchSatoshi.post('/user/verify/email', params)
  },
  /** send sms verify code */
  sendSmsVerify(params: UserSmsVerifyParams) {
    return fetchSatoshi.post('/user/verify/sms', params)
  },
}
