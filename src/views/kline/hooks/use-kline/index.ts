import { useTranslation } from 'react-i18next'

import { useChartStore } from '@/stores/use-chart-store'
import { useDatafeed } from '../use-datafeed'
import { useStorage } from '@/hooks/use-storage'
import { useThemeStore } from '@/stores/use-theme-store'
import { TV_CHART_OPTIONS } from '@/config/tradingview'
import { FormatExportedDataHandler } from '@/views/kline/hooks/use-kline-format/types'
import { useKLineFormat } from '@/views/kline/hooks/use-kline-format'
import { StudyName } from '@/config/kline'
import {
  widget,
  ResolutionString,
  LanguageCode,
  IChartingLibraryWidget,
  ExportDataOptions,
} from '../../../../../public/tradingview/charting_library/charting_library'
import { useTagParser } from '../use-tag-parser'

import type { CexParams, DexParams } from '../use-kline-api/types'

export const useKLineCreate = () => {
  const { chart, setChart, setChartEl, setInterval } = useChartStore()
  const { datafeeder, disconnect } = useDatafeed()
  const { getLang } = useStorage()
  const { isDark } = useThemeStore()
  const { i18n } = useTranslation()
  const { formatExportedData, toTVInterval } = useKLineFormat()
  const { joinParams } = useTagParser()

  // Create a chart.
  // When the chart is created, WebSocket will be established.
  const createChart = (
    container: HTMLElement,
    params: CexParams | DexParams
  ) => {
    return new Promise<IChartingLibraryWidget>((resolve, reject) => {
      const { symbol, interval: normalInterval } = joinParams(params)
      const theme = isDark ? 'dark' : 'light'
      const locale = (getLang() ?? i18n.language) as LanguageCode
      const interval = toTVInterval(normalInterval) as ResolutionString
      const datafeed = datafeeder(params)

      // For static params, should be set in the chart create before.
      setChartEl(container)
      setInterval(toTVInterval(normalInterval))
      try {
        const chart = new (widget ?? window.TradingView.widget)({
          container,
          symbol,
          interval,
          datafeed,
          locale,
          theme: 'light', // Fixed theme
          autosize: true,
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
  const findStudy = (studyName: StudyName) => {
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
