import type {
  PinBars,
  RedBlackSoldiers,
  SpiralCandles,
  UseStudiesAnalysis,
} from './types'

export const useStudiesAnalysis: UseStudiesAnalysis = () => {
  const redBlackSoldiers: RedBlackSoldiers = (first, second, third) => {
    if (!first || !second || !third) return false

    const [, fOpen, , , fClose] = Array.from(first)
    const [, sOpen, , , sClose] = Array.from(second)
    const [, tOpen, , , tClose] = Array.from(third)

    if (
      fClose > fOpen && // First bar is red
      sClose > sOpen && // Second bar is red
      tClose > tOpen && // Third bar is black
      sOpen < fClose && // The second bar open price less than the first bar close price
      tClose > Math.max(fClose, sClose) // The third bar close price less than the second bar open price
    ) {
      return true
    }

    return false
  }

  const detectPinBars: PinBars = (
    { high = 0, open = 0, close = 0, low = 0 },
    threshold
  ) => {
    const upperShadow = high - Math.max(open, close)
    const lowerShadow = Math.min(open, close) - low

    // Whether the pin bar is bullish or bearish
    if (upperShadow >= threshold && lowerShadow >= threshold) return true
    return false
  }

  // bullish or bearish spiral.
  const detectSpiralCandles: SpiralCandles = (type, first, second, third) => {
    if (!first || !second || !third) return

    const [fTime, fOpen] = Array.from(first)
    const [, sOpen, , , sClose] = Array.from(second)
    const [, tOpen, tHigh, tLow, tClose] = Array.from(third)

    if (type === 'bearish') {
      // Is bearish spiral.
      if (
        fTime > fOpen &&
        sOpen > sClose &&
        sClose <= fOpen &&
        tOpen > tClose &&
        tOpen <= sOpen &&
        tClose <= sClose &&
        tHigh <= sOpen &&
        tLow >= sClose
      )
        return true
      return false
    } else if (type === 'bullish') {
      // Is bullish spiral.
      if (
        fOpen > fTime &&
        sClose > sOpen &&
        sOpen >= fTime &&
        tClose > tOpen &&
        tOpen >= sOpen &&
        tClose >= sClose &&
        tLow >= sOpen &&
        tHigh <= sClose
      )
        return true
      return false
    }

    return false
  }

  return { redBlackSoldiers, detectPinBars, detectSpiralCandles }
}
