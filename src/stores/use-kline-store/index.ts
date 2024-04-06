import { create } from 'zustand'

import type { States, Actions } from './types'

/**
 * Pure kline store, it's just sharing kline chart data.
 *
 * Such as: `chart`, `chartEl`, `interval` etc. no logic.
 */
export const useKLineStore = create<States & Actions>((set) => ({
  chart: null,
  chartEl: null,
  interval: '1',

  setChart: (chart) => set({ chart }),
  setChartEl: (tvChartEl) => set({ chartEl: tvChartEl }),
  setInterval: (interval) => set({ interval }),
  getResetCacheMap: () => new Map(),
  setResetCacheMap: (getResetCacheMap) => set({ getResetCacheMap }),
}))
