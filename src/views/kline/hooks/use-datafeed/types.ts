import { ResetCacheMap } from '../use-datafeed-cache'

import type { IBasicDataFeed } from '../../../../../public/tradingview/charting_library/charting_library'

export interface UseDatafeed {
  (options?: UseDatafeedOptions): UseDatafeedReturn
}

export interface UseDatafeedOptions {}

export interface DatafeederOptions {
  interval: '1m' | '1d'
}

export interface UseDatafeedReturn {
  datafeeder: Datafeeder
  getResetCacheMap(): ResetCacheMap
}

export interface Datafeeder {
  (options?: DatafeederOptions): IBasicDataFeed
}
