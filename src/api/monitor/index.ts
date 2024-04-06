import { fetchSatoshi } from '..'
import { MonitorParam, MonitorConfigData, MonitorListData } from './type'

export const monitorApi = {
  update(data: MonitorParam) {
    return fetchSatoshi.post('/api/v1/subscription/create/', data)
  },
  getConfig() {
    return fetchSatoshi.get<MonitorConfigData>('/api/v1/subscription/list/')
  },
  getSubscriptionList() {
    return fetchSatoshi.get<MonitorListData>('/api/v1/subscription/list/')
  },
}
