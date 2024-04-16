import { create } from 'zustand'

import type { IChartingLibraryWidget } from '../../public/tradingview/charting_library/charting_library'

interface States {
  chart: IChartingLibraryWidget | null
  chartEl: HTMLElement | null
  interval: string
}

interface Actions {
  setChart(chart: IChartingLibraryWidget): void
  setChartEl(el: HTMLElement | null): void
  setInterval(interval: string): void
}

/**
 * Pure chart store, it's just sharing kline chart data.
 *
 * Such as: `chart`, `chartEl`, `interval` etc. no business logic.
 */
export const useChartStore = create<States & Actions>((set) => ({
  chart: null,
  chartEl: null,
  interval: '1',

  setChart: (chart) => set({ chart }),
  setChartEl: (tvChartEl) => set({ chartEl: tvChartEl }),
  setInterval: (interval) => set({ interval }),
}))
