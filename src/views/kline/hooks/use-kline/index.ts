import { useTranslation } from 'react-i18next'

import { useKLineStore } from '@/stores/use-kline-store'
import { useDatafeed } from '../use-datafeed'
import { useStorage } from '@/hooks/use-storage'
import { useThemeStore } from '@/stores/use-theme-store'
import { TV_CHART_OPTIONS, TV_INTERVAL_MAP } from '@/config/tradingview'
import { FormatExportedDataHandler } from '@/views/kline/hooks/use-kline-format/types'
import { useKLineFormat } from '@/views/kline/hooks/use-kline-format'
import { StudiesName } from '@/config/kline'
import {
  widget,
  ResolutionString,
  LanguageCode,
  IChartingLibraryWidget,
  ExportDataOptions,
} from '../../../../../public/tradingview/charting_library/charting_library'

import type CreateChartOptions from './types'

export const useKLine = () => {
  const { chart, setChart, setChartEl, setInterval, setResetCacheMap } =
    useKLineStore()
  const { datafeeder, getResetCacheMap, disconnect } = useDatafeed()
  const { getLang } = useStorage()
  const { isDark } = useThemeStore()
  const { i18n } = useTranslation()
  const { formatExportedData } = useKLineFormat()

  // Create a chart.
  // When the chart is created, WebSocket will be established.
  const createChart = (container: HTMLElement, options: CreateChartOptions) => {
    return new Promise<IChartingLibraryWidget>((resolve, reject) => {
      const { symbol, interval } = options
      const theme = isDark ? 'dark' : 'light'
      const locale = (getLang() ?? i18n.language) as LanguageCode
      const tvInterval = TV_INTERVAL_MAP[interval] as ResolutionString

      console.log('create interval', tvInterval)
      // For static params, should be set in the chart create before.
      setChartEl(container)
      setInterval(interval)
      setResetCacheMap(getResetCacheMap)
      try {
        const chart = new (widget ?? window.TradingView.widget)({
          container,
          symbol,
          locale,
          theme: 'light', // Fixed theme
          autosize: true,
          datafeed: datafeeder(),
          // TODO: Optimized the map.
          interval: tvInterval,
          timezone: 'Etc/UTC',
          ...TV_CHART_OPTIONS,
        })

        chart.onChartReady(() => {
          setChart(chart)
          resolve(chart)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Get chart exported data.
  const getChartData = (
    handler?: FormatExportedDataHandler,
    ops?: Partial<ExportDataOptions>
  ) => {
    return new Promise((resolve, reject) => {
      if (!chart) {
        reject([])
        return
      }

      setTimeout(async () => {
        try {
          const exportedData = await chart.activeChart().exportData(ops)
          const data = formatExportedData(exportedData, handler)

          resolve(data)
        } catch (error) {
          resolve([])
        }
      }, 300)
    })
  }

  // Find a study from study name.
  const findStudy = (studyName: StudiesName) => {
    if (!chart) return
    const activeChart = chart?.activeChart()

    return activeChart.getAllStudies().find((s) => s.name === studyName)
  }

  const clearChart = () => {
    chart?.remove()
    disconnect()
  }

  return {
    chart,
    createChart,
    getChartData,
    findStudy,
    clearChart,
  }
}
