import { TV_INTERVAL_MAP } from '@/config/tradingview'

export default interface CreateChartOptions {
  symbol: string
  interval: keyof typeof TV_INTERVAL_MAP
}
