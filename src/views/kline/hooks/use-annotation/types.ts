import type { Study, KLINE_ANNOTATION } from '@/config/kline'
import type {
  EntityId,
  PricedPoint,
  CreateMultipointShapeOptions,
  DrawingEventType,
  CreateShapeOptions,
} from './../../../../../public/tradingview/charting_library/charting_library.d'

export interface UseAnnotations {
  (clickHandlers?: Partial<UseAnnotationsClickhandlers>): UseAnnotationsReturn
}

export interface UseAnnotationsClickhandlers {
  onForksClick: (params: ClickHandlerParams) => void
  onOverBoughtSoldClick: (params: ClickHandlerParams) => void
  onDivergenceClick: (params: ClickHandlerParams) => void
  onPressureSupportClick: (params: ClickHandlerParams) => void
}

export interface UseAnnotationsReturn {
  createForks: CreateTwoShape
  createPressureSupport: CreateTwoShape
  createOverBoughtSold: CreateOverBoughtSold
  createDivergence: CreateTwoShape
  handleShapeClick: HandleShapeClick
}

export type CreateTwoShape = (optionTuple: [ShapeOptions, ShapeOptions]) => void

export type IdOrNull = EntityId | null

export interface ShapeOptions {
  time: number
  price: number
  studyName?: string
  ownerId?: EntityId
}

export type CreateOverBoughtSold = (
  type: OverBoughtSoldType,
  options: ShapeOptions
) => void

export type HandleShapeClick = (id: EntityId, event: DrawingEventType) => void

export type CreateOptions<T extends string> = {
  [k in T]: ShapeOptions
}

export type ForksType = 'golden' | 'death'

export type PressureSupportType = 'pressure' | 'support'

export type OverBoughtSoldType = 'bought' | 'sold'

export type DivergenceType = 'top' | 'bottom'

export type ShapeClickHandler<T, P> = (
  params: ShapeClickHandlerParams<T, P>
) => void

export interface ShapeClickHandlerParams<T, P> {
  type: T
  title: P | undefined
  studyNickname?: string
  shapeId?: IdOrNull
  studyId?: IdOrNull
}

export type CreateStudy = (study: Study) => Promise<void>

export interface ClickHandler extends ClickHandlerParams {
  onClick: () => void
}

export type AddClickHandler = (params: ClickHandlerParams) => void

export interface ClickHandlerParams
  extends ICreateShapeOptions,
    CreateMultipointShapeOptions<object> {
  type: keyof typeof KLINE_ANNOTATION.tips
  shapeId: IdOrNull
  onClick?: (params: ClickHandlerParams) => void
  getVisible: () => boolean
  setVisible: (visible: boolean) => void
}

export type MarketType = 'bullish' | 'bearish'

export interface ICreateShapeOptions {
  type: keyof typeof KLINE_ANNOTATION.tips
  colorType?: MarketType
  rawOptions: ShapeOptions
}

export type CreateShape = (
  shapePoint: PricedPoint,
  shapeOptions: ICreateShapeOptions & CreateShapeOptions<object>
) => IdOrNull

export type CreateMultiShape = (
  shapePoint: PricedPoint | PricedPoint[],
  shapeOptions: ICreateShapeOptions & CreateMultipointShapeOptions<object>
) => IdOrNull

export type Direction = 'up' | 'right' | 'down' | 'left'

export interface ArrowPointOptions extends PricedPoint {
  type: keyof typeof KLINE_ANNOTATION.tips
  text: string
  ownerStudyId?: EntityId
}

export type CreateTextArrow = (
  direction: Direction,
  options: ArrowPointOptions & ICreateShapeOptions
) => [IdOrNull, IdOrNull]
