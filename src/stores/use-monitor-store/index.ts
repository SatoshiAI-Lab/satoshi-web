import { create } from 'zustand'

import { monitorApi } from '@/api/monitor'

import type { Actions, States } from './type'

export const useMonitorStore = create<States & Actions>((set, get) => ({
  configData: undefined,
  update: async () => {
    const { data } = await monitorApi.getConfig()
    set({ configData: data })
  },
  setConfig: async (data) => {
    const { message_type: type, content: newData } = data

    // if (type != null) {
    const configData = {
      ...get().configData!,
    }

    //   if (type == MonitorConfig.news) {
    //     configData.news = newData
    //   }

    //   if (type == MonitorConfig.pool) {
    //     configData.pool = newData
    //   }

    //   // if (type == MonitorConfig.trade) {
    //   //   configData.trade.content = newData
    //   // }

    //   if (type == MonitorConfig.announcement) {
    //     configData.announcement = newData
    //   }

    set({
      configData,
    })
    // }
    await monitorApi.update(data)
    await get().update()
  },
  timerByUpdate: (data) => set({ configData: data }),
}))
