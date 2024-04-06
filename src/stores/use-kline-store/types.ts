import type { IChartingLibraryWidget } from '../../../public/tradingview/charting_library/charting_library'
import type { ResetCacheMap } from '@/views/kline/hooks/use-datafeed-cache'

export interface States {
  chart: IChartingLibraryWidget | null
  chartEl: HTMLElement | null
  interval: string
}

export interface Actions {
  setChart(chart: IChartingLibraryWidget): void
  setChartEl(el: HTMLElement | null): void
  setInterval(interval: string): void
  getResetCacheMap(): ResetCacheMap
  setResetCacheMap(getter: () => ResetCacheMap): void
}

export interface CreateChartOptions {
  symbol: string
  interval: string
  theme?: 'dark' | 'light'
  timezone?: string
}

export interface CreateButtonOptions {
  title: string
  onClick(): void
  attrKey?: string
  attrValue?: string
}

export interface ChartDataItem {
  time: number
  high: number
  open: number
  low: number
  close: number
  volume: number
}
