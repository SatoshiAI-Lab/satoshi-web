import type { FormatExportedDataItem } from '../use-kline-format/types'

/**
 * KLine pattern analysis.
 */
export interface UseStudiesAnalysis {
  (): UseStudiesAnalysisReturn
}

/** Analysis methods. */
export interface UseStudiesAnalysisReturn {
  /** Red black three soldiers. */
  redBlackSoldiers: RedBlackSoldiers
  /** Needle pattern */
  detectPinBars: PinBars
  /** Upward/downward spiral */
  detectSpiralCandles: SpiralCandles
}

export type RedBlackSoldiers = (
  first: Float64Array,
  second: Float64Array,
  third: Float64Array
) => boolean

export type PinBars = (
  data: FormatExportedDataItem,
  threshold: number
) => boolean

export type SpiralCandles = (
  type: 'bearish' | 'bullish',
  first: Float64Array,
  second: Float64Array,
  third: Float64Array
) => void
