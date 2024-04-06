import {
  StudyInputValue,
  StudyOverrides,
  CreateStudyOptions,
} from '../../public/tradingview/charting_library/charting_library'

export interface Studies<T = Study> {
  vol: T
  ma: T
  ema: T
  boll: T
  wr: T
  macd: T
  rsi: T
  // kdj: T
  // stochRSI: T
}

export interface Study {
  label: string
  /** Show on main chart */
  isMain?: boolean
  // Below is study props, above is custom props.
  name: `${StudiesName}`
  forceOverlay?: boolean
  /** If locked, cannot open setting dialog. */
  lock?: boolean
  inputs?: Record<string, StudyInputValue>
  overrides?: StudyOverrides
  options?: CreateStudyOptions
}

/**
 * Studies name map.
 */
export enum StudiesName {
  VOL = 'Volume',
  MA = 'MA Cross',
  EMA = 'EMA Cross',
  BOLL = 'Bollinger Bands',
  WR = 'Williams %R',
  MACD = 'MACD',
  RSI = 'Relative Strength Index',
  // KDJ = 'Stochastic',
  // STOCHRSI = 'Stochastic RSI',
}

/**
 * Studies config.
 */
export const KLINE_STUDIES: Studies<Study> = {
  vol: {
    label: 'VOL',
    name: StudiesName.VOL,
    isMain: true,
  },
  ma: {
    label: 'MA',
    name: StudiesName.MA,
    inputs: {
      in_0: 7,
      in_1: 30,
    },
    isMain: true,
  },
  ema: {
    label: 'EMA',
    name: StudiesName.EMA,
    inputs: {
      in_0: 7,
      in_1: 30,
    },
    isMain: true,
  },
  boll: {
    label: 'BOLL',
    name: StudiesName.BOLL,
    inputs: {
      in_0: 21,
      in_1: 2,
    },
    isMain: true,
  },
  // Below is subchart studies, above is main chart studies.
  wr: {
    label: 'WR',
    name: StudiesName.WR,
    inputs: {
      in_0: 14,
      in_1: 'open',
      in_2: '',
      in_3: true,
    },
  },
  macd: {
    label: 'MACD',
    name: StudiesName.MACD,
    inputs: {
      in_0: 12,
      in_1: 26,
      in_2: 9,
    },
  },
  rsi: {
    label: 'RSI',
    name: StudiesName.RSI,
    inputs: {
      length: 6,
      smoothingLine: 'SMA',
      smoothingLength: 14,
    },
    overrides: {
      'smoothed ma.display': 15,
    },
  },
  // kdj: {
  //   label: 'KDJ',
  //   name: 'Stochastic', // KDJ also Stochastic
  // },
  // stochRSI: {
  //   label: 'StochRSI',
  //   name: 'Stochastic RSI',
  // },
}

/**
 * Chart annotation emoji/text/color config
 */
export const KLINE_ANNOTATION = {
  emojis: {
    overbuy: '⛰️',
    oversell: '⚓',
    goldenFork: '😄',
    deathFork: '😕',
    support: '💪',
    pressure: '☁️',
  },
  colors: {
    blue: '#2d47fa',
    red: '#FF0000',
  },
  // text tips
  tips: {
    bought:
      'The current price is in the overbought zone, indicating a high probability of a downward movement in this cycle. The trend may reverse.',
    sold: 'The current price is in the oversold zone, indicating a high probability of an upward movement in this cycle. The trend may reverse.',
    golden:
      'A golden cross indicates a potential trend reversal and a high probability of an upward movement.',
    death:
      'A death cross indicates a potential trend reversal and a high probability of a downward movement.',
    top: 'A bearish divergence indicates a potential top reversal and a high probability of a downward movement.',
    bottom:
      'A bullish divergence indicates a potential bottom reversal and a high probability of an upward movement.',
    support:
      'The price may encounter support at this level, indicating the possibility of a price rebound or a potential trend reversal.',
    pressure:
      'The price may encounter resistance at this level, leading to a temporary halt in the upward movement or a pullback.',
  },
} as const

export const KLINE_RESOLUTIONS = [
  {
    name: '1m',
    interval: '1',
  },
  {
    name: '5m',
    interval: '5',
  },
  {
    name: '15m',
    interval: '15',
  },
  {
    name: '30m',
    interval: '30',
  },
  {
    name: '1h',
    interval: '60',
  },
  {
    name: '4h',
    interval: '240',
  },
  // {
  //   name: '8h',
  //   interval: '8h',
  // },
  {
    name: '1d',
    interval: '1D',
  },
  // {
  //   name: 'Week',
  //   interval: '1w',
  // },
  // {
  //   name: 'Month',
  //   interval: '1M',
  // },
] as const

export type KLINE_SUPPORTED_INTERVALS =
  (typeof KLINE_RESOLUTIONS)[number]['interval']
