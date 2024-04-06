import { userApi } from '@/api/user'
import { useStorage } from './use-storage'
import { useUserStore } from '@/stores/use-user-store'

let timer: NodeJS.Timeout
export const useTokenRefresh = () => {
  const { setToken } = useUserStore()
  const { getLoginTokenRefresh } = useStorage()
  const limitTime = 1 * 60 * 60 * 1000

  const _watch = async (token: string, time: number) => {
    if (Date.now() - time > limitTime) {
      const { data } = await userApi.refresh(token)
      setToken(data.access!, data.refresh!)
    }
  }

  const watch = () => {
    if (timer == null) clearInterval(timer)

    const tokenData = getLoginTokenRefresh()

    if (tokenData?.token == null || tokenData?.time == null) return

    timer = setInterval(() => {
      _watch(tokenData.token, tokenData.time)
    }, 60_000)
  }

  return {
    watch,
  }
}
