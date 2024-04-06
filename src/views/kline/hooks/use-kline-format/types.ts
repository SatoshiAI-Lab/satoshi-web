import type {
  Bar,
  ExportedData,
  ResolutionString,
} from '../../../../../public/tradingview/charting_library/charting_library'
import type { ReceivedBar } from '../use-kline-api/types'

export interface UseKLineFormat {
  (): UseTVFormatReturn
}

export interface UseTVFormatReturn {
  /**
   * Formatting exported data
   * @param rawData The raw data to be formatted.
   * @param handler Handle function, each formatted will be called.
   * @returns Return formatted result.
   */
  formatExportedData: FormatExportedData
  /**
   * Convert an array that meets the format to an array object that TradingView requires.
   * @param arr Meeting format: `[time, open, high, low, close, volume]`
   * @param isMilliseconds Array element `time` prop is milliseconds? default: `false`.
   * @returns Metting `FormatExportedDataSeries` type array.
   **/
  arrayToSeries: ArrayToSeries
  /**
   * TradingView minutes is `1`, not `1m`, need to fix it.
   * @param str A string
   * @returns Metting `ReceivedInterval` type string.
   **/
  fixMinute: FixMinute
  /**
   * Convert Websoket received data to `Bar` format required by TradingView.
   * @param bars Received bar array.
   * @param count total data count.
   * @param fill When `bars.length < count`, fill `count`
   */
  formatReceivedBars: FormatReceivedBars
  /**
   * Chart price to fixed,
   * Original rule: Keeping one decimal place for 10, two decimal places for 100, and so on.
   * it's not easy use.
   * @param num Target to fixed.
   * @return Return a number than is suitable `pricescale`.
   */
  priceToPricescale: PriceToPricescale
}

export interface FormatExportedData {
  (
    rawData: ExportedData,
    handler?: FormatExportedDataHandler
  ): FormatedExportedDataItem[][]
}

export interface ArrayToSeries {
  (floatArr: (Float64Array | number[])[], isMilliseconds?: boolean): Required<
    Omit<FormatExportedDataSeries, 'userTime' | 'turnover' | '_ts'>
  >[]
}

export interface FixMinute {
  (str: ResolutionString): string
}

export interface FormatReceivedBars {
  (bars: ReceivedBar[], count?: number, fill?: boolean): Bar[]
}

export interface PriceToPricescale {
  (price: number): number
}

export interface FormatExportedDataHandler {
  (item: FormatExportedDataItem, index: number, rawData: ExportedData): void
}

/** Formatted data */
export interface FormatExportedDataItem extends FormatExportedDataSeries {
  /** Unformatted raw data. */
  raw: number[]
  /** Formatted data from raw. */
  formated: FormatedExportedDataItem[]
  [k: string]: any
}

export interface FormatExportedDataSeries extends ReceivedBar {
  userTime?: number
}

/** MA Cross */
export type FormatExportedDataMACross = Partial<{
  Crosses: number
  Long: number
  Short: number
}>

export type FormatedExportedDataItem =
  | {
      value: number
      type: 'time'
    }
  | {
      value: number
      type: 'userTime'
    }
  | {
      value: number
      type: 'value'
      sourceType: 'series'
      plotTitle: string
      sourceTitle: string
    }
  | {
      value: number
      type: 'value'
      sourceType: 'study'
      sourceId: string
      sourceTitle: string
      plotTitle: string
    }
