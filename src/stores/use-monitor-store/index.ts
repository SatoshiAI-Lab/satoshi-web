import { create } from 'zustand'
import { Actions, States } from './type'
import { useQuery } from '@tanstack/react-query'
import { monitorApi } from '@/api/monitor'
import { MonitorConfig } from '@/config/monitor'

export const useMonitorStore = create<States & Actions>((set, get) => ({
  configData: undefined,
  update: async () => {
    const { data } = await monitorApi.getConfig()
    set({ configData: data })
  },
  setConfig: async (data, rawData) => {
    const { message_type: type, content: newData } = data
    if (type != null) {
      const configData = {
        ...get().configData!,
      }

      if (type == MonitorConfig.news) {
        configData.news = newData
      }

      if (type == MonitorConfig.pool) {
        configData.pool = newData
      }

      if (type == MonitorConfig.trade) {
        configData.trade = newData
      }

      if (type == MonitorConfig.announcement) {
        configData.announcement = newData
      }

      set({
        configData,
      })
    }
    await monitorApi.update(data)
    await get().update()
  },
  timerByUpdate: (data) => set({ configData: data }),
}))
