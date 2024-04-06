import { useTranslation } from 'react-i18next'

import { useKLineStore } from '@/stores/use-kline-store'
import { KLINE_ANNOTATION } from '@/config/kline'
import { RESOLUTION_TIMESTAMP_MAP } from '@/config/tradingview'

import type {
  CreateShape,
  ClickHandler,
  CreateTwoShape,
  CreateTextArrow,
  ICreateShapeOptions,
  CreateOverBoughtSold,
  MarketType,
  UseAnnotations,
  AddClickHandler,
  HandleShapeClick,
  ArrowPointOptions,
  CreateMultiShape,
} from './types'
import type {
  EntityId,
  CreateShapeOptionsBase,
} from '../../../../../public/tradingview/charting_library/charting_library'

/**
 * Used only for create study annotation.
 * @param clickListeners Listen annotation click event.
 */
export const useAnnotations: UseAnnotations = (clickListeners) => {
  const {
    onForksClick,
    onDivergenceClick,
    onOverBoughtSoldClick,
    onPressureSupportClick,
  } = clickListeners ?? {}
  const { colors, emojis, tips } = KLINE_ANNOTATION
  const { chart } = useKLineStore()
  const { t } = useTranslation()
  const clickHandlers: ClickHandler[] = []
  const clickMap = {
    golden: onForksClick,
    death: onForksClick,
    pressure: onPressureSupportClick,
    support: onPressureSupportClick,
    bought: onOverBoughtSoldClick,
    sold: onOverBoughtSoldClick,
    bottom: onDivergenceClick,
    top: onDivergenceClick,
    undefined() {},
  } as Record<keyof typeof tips, Function>

  // Override default options
  const getDefaultOpts = (type: MarketType = 'bullish') => {
    const color = type === 'bullish' ? colors.blue : colors.red

    return {
      lock: true,
      zOrder: 'top',
      disableUndo: true,
      disableSelection: true,
      overrides: {
        color,
        arrowColor: color,
        linecolor: color,
      },
    } as CreateShapeOptionsBase<object>
  }

  // Unified create shape.
  const createShape: CreateShape = (point, options) => {
    if (Number.isNaN(point.time)) return null

    const { colorType } = options
    const activeChart = chart?.activeChart()
    const shapeId =
      activeChart?.createShape(point, {
        ...getDefaultOpts(colorType),
        ...options,
      }) ?? null

    addClickHandler({
      ...options,
      shapeId,
      getVisible: () => true,
      setVisible: () => {},
    })

    return shapeId
  }

  // Unified create multi shape.
  const createMultiShape: CreateMultiShape = (point, options) => {
    point = Array.isArray(point) ? point : [point]
    const pointHasNaN = point.find(
      (p) => Number.isNaN(p.time) || Number.isNaN(p.price)
    )

    if (pointHasNaN) return null

    const { colorType } = options
    const activeChar = chart?.activeChart()
    const shapeId =
      activeChar?.createMultipointShape(point, {
        ...getDefaultOpts(colorType),
        ...options,
      }) ?? null

    addClickHandler({
      ...options,
      shapeId,
      getVisible: () => true,
      setVisible: () => {},
    })

    return shapeId
  }

  // Calculate the length of arrow from the price range.
  const calcTickPrice = (from: number, to: number) => {
    const diff = to - from

    return (diff * 0.2) / 2
  }

  // Get the price range.
  const getPriceRange = (mainOrId: {
    isMain?: boolean
    ownerStudyId?: EntityId | undefined
  }) => {
    const { isMain, ownerStudyId } = mainOrId
    const activeChart = chart?.activeChart()

    if (!activeChart) return
    if (isMain || !ownerStudyId) {
      return activeChart
        .getPanes()[0]
        .getRightPriceScales()[0]
        .getVisiblePriceRange()
    }

    const pane = activeChart.getPanes().find((pane) => {
      const ids = pane.getRightPriceScales()[0].getStudies()
      return ids.includes(ownerStudyId)
    })

    return pane?.getRightPriceScales()[0].getVisiblePriceRange()
  }

  // Create arrow with text.
  const createTextArrow: CreateTextArrow = (direction, point) => {
    const { time, price, text, ownerStudyId } = point
    const { from, to } = getPriceRange({ ownerStudyId }) ?? { from: 0, to: 0 }
    const isVertical = direction === 'up' || direction === 'down'
    const isDown = direction === 'down'
    const activeChart = chart?.activeChart()
    const resolution = activeChart?.resolution()
    const startPoint: ArrowPointOptions & ICreateShapeOptions = {
      ...point,
      time: getOffsetTime('arrow'),
      price: getOffsetPrice('arrow'),
    }
    const arrowId = createMultiShape([startPoint, point], {
      ...point,
      shape: 'arrow',
      text: '', // This is required, override point text
      ownerStudyId,
    })
    const textId = createMultiShape(
      {
        time: getOffsetTime('text'),
        price: getOffsetPrice('text'),
      },
      {
        ...point,
        shape: 'text',
        text,
        ownerStudyId,
      }
    )

    function getOffsetTime(type: 'arrow' | 'text') {
      const interval = resolution as keyof typeof RESOLUTION_TIMESTAMP_MAP
      // Arrow
      if (type === 'arrow') {
        const horizontal = time + RESOLUTION_TIMESTAMP_MAP[interval] * 10
        return isVertical ? time : horizontal
      }

      const horiz = RESOLUTION_TIMESTAMP_MAP[interval]

      const less = time - horiz * 4
      const add = time + horiz * 10

      // Text
      return isVertical ? less : add
    }

    function getOffsetPrice(type: 'arrow' | 'text') {
      // Arrow
      if (type === 'arrow') {
        const vertical = isDown
          ? price + calcTickPrice(from, to)
          : price - calcTickPrice(from, to)

        return isVertical ? vertical : price
      }

      const vertical = isDown
        ? startPoint.price + calcTickPrice(from, to) / 2
        : startPoint.price - calcTickPrice(from, to) * 0.1

      // Text
      return isVertical
        ? vertical
        : startPoint.price + calcTickPrice(from, to) / 5
    }

    return [arrowId, textId]
  }

  // Create golden/death forks.
  const createForks: CreateTwoShape = (options) => {
    const [golden, death] = options
    const goldenText = `${golden.studyName} ${t('kline.golden')} ${
      emojis.goldenFork
    }`
    const deathText = `${death.studyName} ${t('kline.death')} ${
      emojis.deathFork
    }`

    createShape(
      {
        time: golden.time,
        price: golden.price,
      },
      {
        shape: 'arrow_up',
        ownerStudyId: golden.ownerId,
        text: goldenText,
        rawOptions: golden,
        type: 'golden',
      }
    )
    createShape(
      {
        time: death.time,
        price: death.price,
      },
      {
        shape: 'arrow_down',
        ownerStudyId: death.ownerId,
        text: deathText,
        colorType: 'bearish',
        rawOptions: death,
        type: 'death',
      }
    )
  }

  // Create pressure/support position.
  const createPressureSupport: CreateTwoShape = (options) => {
    const [pressure, support] = options
    const pressureText = `${pressure.studyName} ${t('kline.resistance')} ${
      emojis.pressure
    }`
    const supportText = `${support.studyName} ${t('kline.support')} ${
      emojis.support
    }`

    createTextArrow('left', {
      time: pressure.time,
      price: pressure.price,
      ownerStudyId: pressure.ownerId,
      text: pressureText,
      rawOptions: pressure,
      type: 'pressure',
    })
    createTextArrow('left', {
      time: support.time,
      price: support.price,
      ownerStudyId: support.ownerId,
      text: supportText,
      rawOptions: support,
      type: 'support',
    })
  }

  // Create over bought/oversold.
  const createOverBoughtSold: CreateOverBoughtSold = (type, data) => {
    const text =
      type === 'bought'
        ? `${data.studyName} ${t('kline.overbuy')} ${emojis.overbuy}`
        : `${data.studyName} ${t('kline.oversell')} ${emojis.oversell}`

    createMultiShape(
      {
        time: data.time,
        price: data.price,
      },
      {
        type,
        shape: 'text',
        rawOptions: data,
        text: `${data.studyName} ${text}`,
        ownerStudyId: data.ownerId!,
        colorType: type === 'bought' ? 'bearish' : 'bullish',
      }
    )
  }

  // Create divergence.
  const createDivergence: CreateTwoShape = (options) => {
    const [top, bottom] = options
    const topText = `${top.studyName} ${t('kline.bearish-divergence')} ${
      emojis.deathFork
    }`
    const bottomText = `${bottom.studyName} ${t('kline.bullish-divergence')} ${
      emojis.goldenFork
    }`

    createShape(
      {
        time: top.time,
        price: top.price,
      },
      {
        shape: 'arrow_down',
        ownerStudyId: top.ownerId,
        text: topText,
        rawOptions: top,
        type: 'top',
        colorType: 'bearish',
      }
    )
    createShape(
      {
        time: bottom.time,
        price: bottom.price,
      },
      {
        shape: 'arrow_up',
        ownerStudyId: bottom.ownerId,
        text: bottomText,
        rawOptions: bottom,
        type: 'bottom',
      }
    )
  }

  // Get the visibility of the study. Provided to the external.
  const getVisible = (id: EntityId | undefined) => {
    if (!id) return false

    return chart?.activeChart().getStudyById(id).isVisible()
  }

  // Set the visible of the study. Provided to the external.
  const setVisible = (id: EntityId | undefined, visible: boolean) => {
    if (!id) return

    chart?.activeChart().getStudyById(id).setVisible(visible)
  }

  // Add click event.
  const addClickHandler: AddClickHandler = (handler) => {
    clickHandlers.push({
      ...handler,
      onClick: () => {
        clickMap[handler.type]({
          ...handler,
          getVisible: () => getVisible(handler.ownerStudyId),
          setVisible: (visible: boolean) => {
            setVisible(handler.ownerStudyId, visible)
          },
        })
      },
    })
  }

  // Handling shape click event.
  const handleShapeClick: HandleShapeClick = (id, event) => {
    if (event !== 'click') return

    clickHandlers.map((handler) => {
      if (handler.shapeId !== id) return

      handler.onClick()
    })
  }

  return {
    createForks,
    createPressureSupport,
    createOverBoughtSold,
    createDivergence,
    handleShapeClick,
  }
}
