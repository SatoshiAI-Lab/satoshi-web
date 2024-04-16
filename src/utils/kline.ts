import { ResolutionString } from '../../public/tradingview/charting_library/charting_library'

export const utilChart = {
  /**
   * Is it a multiple of the target period?
   * used for subscribeBars single update or all update.
   * @param target Target period
   * @returns `true` is multiple, `false` not.
   */
  isTargetPeriod(resolution: ResolutionString): boolean {
    const currentDate = new Date()

    function removeLetter(letter: ResolutionString) {
      const result = letter.match(/\d+/)?.[0] ?? letter

      return Number(result)
    }

    switch (resolution) {
      case '1':
      case '5':
      case '15':
      case '30':
        return currentDate.getMinutes() % removeLetter(resolution) === 0
      case '60': // 1h
      case '240': // 4h
        return currentDate.getHours() % removeLetter(resolution) === 0
      case '1D':
        return currentDate.getDate() % removeLetter(resolution) === 0
      //   case 'week':
      //   return currentDate.getDay() === 0 && (currentDate.getDate() % (removeLetter(target) * 7)) === 0;
      // case 'years':
      //   return currentDate.getFullYear() % removeLetter(target) === 0;
      default:
        return false
    }
  },
}
