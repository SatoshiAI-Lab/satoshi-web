import type { Pair } from '@/types/types'
import type {
  ResolutionString,
  LibrarySymbolInfo,
  DatafeedConfiguration,
  ChartPropertiesOverrides,
  ChartingLibraryWidgetOptions,
  TradingTerminalWidgetOptions,
} from '../../public/tradingview/charting_library/charting_library'

// Chart optional options.
type TVChartOptions = Omit<
  ChartingLibraryWidgetOptions | TradingTerminalWidgetOptions,
  // Omit required.
  'container' | 'datafeed' | 'interval' | 'localets' | 'locale'
>

/** TradingView chart options config. */
export const TV_CHART_OPTIONS: TVChartOptions = {
  // debug: true, // output all debug info
  library_path: 'tradingview/charting_library/',
  disabled_features: [
    // Header
    'header_widget',
    'header_resolutions',
    'header_symbol_search',
    'header_compare',
    'header_chart_type',
    'header_indicators',
    'header_undo_redo',
    'header_settings',
    'header_screenshot',
    // Legend
    // 'legend_widget',
    // 'edit_buttons_in_legend',
    'display_market_status',
    // Menu
    'context_menus',
    'show_interval_dialog_on_key_press',
    'property_pages',
    'symbol_search_hot_key',
    // Functionality
    // 'chart_zoom',
    'left_toolbar',
    'timeframes_toolbar', // bottom time tools.
    'main_series_scale_menu', // bottom right setting button.
    'items_favoriting',
    'show_object_tree',
    'create_volume_indicator_by_default',
  ],
  enabled_features: [
    'pre_post_market_sessions',
    // currency logo, need to config in useDatafeed symbolInfo
    // 'show_symbol_logos',
    // 'show_symbol_logo_in_legend',
    'show_spread_operators',
    'move_logo_to_main_pane',
  ],
  // Bottom times.
  time_frames: [
    {
      text: '1m',
      resolution: '1D' as ResolutionString,
      title: '1M',
    },
    {
      text: '6m',
      resolution: '1W' as ResolutionString,
      title: '6M',
    },
    {
      text: '1y',
      resolution: '1W' as ResolutionString,
      title: '1Y',
    },
    {
      text: '3y',
      resolution: '1M' as ResolutionString,
      title: '3Y',
    },
    {
      text: '1000y',
      resolution: '1W' as ResolutionString,
      title: 'All',
    },
  ],
  time_scale: {
    min_bar_spacing: 0,
  },
  // Disable some drawing tools.
  drawings_access: {
    type: 'black',
    tools: [
      // {
      //   name: 'Trend Line', // Must be use displayed lang.
      //   grayed: true,
      // },
    ],
  },
  // overrides: {},
  // studies_overrides: {},
  // If volume doesn't exist, then should be enabled this blacklist,
  // because these indicators need to depend on the volume.
  studies_access: {
    type: 'black',
    tools: [
      { name: 'Accumulation/Distribution' },
      { name: 'Ease of Movement' },
      { name: 'Elders Force Index' },
      { name: 'Klinger Oscillator' },
      { name: 'Money Flow Index' },
      { name: 'Net Volume' },
      { name: 'On Balance Volume' },
      { name: 'Price Volume Trend' },
      { name: 'VWAP' },
      { name: 'Volume Oscillator' },
    ],
  },
}

/** TradingView chart style overrides. */
export const TV_CHART_OVERRIDES: Partial<ChartPropertiesOverrides> = {
  'paneProperties.vertGridProperties.color': 'rgba(255,255,255,0)',
  'paneProperties.horzGridProperties.color': 'rgba(255,255,255,0)',
}

/** TradingView `Datafeed` Config, used for `useDatafeed` */
export const TV_DATAFEED_CONFIG: DatafeedConfiguration = {
  // It's only effective if contains here.
  supported_resolutions: [
    '1',
    '5',
    '15',
    '30',
    '1h',
    '2h',
    '4h',
    '8h',
    '1d',
    '3d',
    '1W',
    '1M',
    '3M',
    '6M',
    '12M',
  ] as ResolutionString[],
  supports_marks: true,
  supports_timescale_marks: true,
}

/** TradingView required format map. */
export const TV_RESOLUTION_MAP = {
  '1': '1m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '240': '4h',
  '480': '8h',
} as const

/** TradingView required format map. */
export const TV_INTERVAL_MAP = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '4h': '240',
  '1d': '1D',
} as const

/**
 * `useDatafeed` -> `resolveSymbol` -> `symbolInfo` config,
 * Here is initial config. you can modify in useDatafeed.
 */
export const TV_SYMBOL_INFO_CONFIG: LibrarySymbolInfo = {
  name: 'BTC',
  type: 'crypto', // Chart type
  session: '24x7', // Trading time. 24x7 is open year-round.
  full_name: 'BTC-USDT', // Trading pair fullname
  description: 'BTC-USDT', // Top left trading pair
  exchange: 'SatoshiGPT', // Top left exchange​
  listed_exchange: 'SatoshiGPT', // Listed exchange​
  format: 'price', // Right price axis.
  timezone: 'Etc/UTC', // timezone.
  supported_resolutions: TV_DATAFEED_CONFIG.supported_resolutions!,
  pricescale: 100, // Needs to be with minmov.
  minmov: 1,
  // Above is required
  // fractional: true,
  // variable_tick_size: '0.00000001 0.1 0.00001 0.1 0.01',
  has_weekly_and_monthly: true,
  has_seconds: true,
  has_ticks: true,
  has_empty_bars: true,
  // If you needs switching resolution to less than one day,
  // here must be `true`.
  has_intraday: true,
  // intraday_multipliers: ['1', '5', '1d'],
  // ticker: 'SatoshiGPT', // used for switching resolution
  visible_plots_set: 'ohlcv',
  volume_precision: 0,
  currency_code: 'BTC',
}

export const TV_DEFAULT_SOURCE_PAIR: Pair = ['binance', 'USDT']

export const TV_DEFAULT_QUOTE = 'USDT'

/** Used for arrow annotation. */
export const RESOLUTION_TIMESTAMP_MAP = {
  '1': 60,
  '5': 5 * 60,
  '15': 15 * 60,
  '30': 30 * 60,
  '1h': 60 * 60,
  '4h': 4 * 60 * 60,
  '1d': 24 * 60 * 60,
  '3d': 3 * 24 * 60 * 60,
  '1W': 7 * 24 * 60 * 60,
  '1M': 30 * 24 * 60 * 60,
  '3M': 90 * 24 * 60 * 60,
  '6M': 180 * 24 * 60 * 60,
  '12M': 360 * 24 * 60 * 60,
} as const
