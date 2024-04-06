import { userApi } from '@/api/user'
import { useStorage } from './use-storage'

let timer: NodeJS.Timeout
export const useTokenRefresh = () => {
  const { getLoginTokenRefresh, setLoginToken, setLoginTokenRefresh } =
    useStorage()
  const limitTime = 1 * 60 * 60 * 1000
  const _watch = async (token: string, time: number) => {
    if (Date.now() - time > limitTime) {
      const { data } = await userApi.refresh(token)
      setLoginToken(data.access!)
      setLoginTokenRefresh(token)
    }
  }

  const watch = () => {
    if (timer == null) clearInterval(timer)
    timer = setInterval(() => {
      const tokenData = getLoginTokenRefresh()
      if (tokenData?.token == null || tokenData?.time == null) return
      _watch(tokenData.token, tokenData.time)
    }, 60_000)
  }

  return {
    watch,
  }
}
