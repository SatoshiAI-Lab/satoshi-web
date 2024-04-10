import type { StudiesName, Study } from '@/config/kline'
import type { FormatExportedDataItem } from '../use-kline-format/types'
import type {
  HandleShapeClick,
  UseAnnotationsClickhandlers,
} from '../use-annotation/types'

export type UseAnnotationStudies = (
  clickHandlers?: Partial<UseAnnotationsClickhandlers>
) => UseAnnotationStudiesReturn

export interface UseAnnotationStudiesReturn<F = () => Promise<void>> {
  createVOL: F
  createMA: F
  createEMA: F
  createBOLL: F
  createWR: F
  createMACD: F
  createRSI: F
  createKDJ: F
  createStochRSI: F
  hiddenAllStudy(): void
  hiddenStudy(studyName: StudiesName | StudiesName[]): void
  handleShapeClick: HandleShapeClick
}

export type GetLastGetter = (
  tuple: [FormatExportedDataItem, FormatExportedDataItem]
) => Promise<[FormatExportedDataItem, FormatExportedDataItem]>

export type GetLastFn = (
  getter: GetLastGetter
) => Promise<[FormatExportedDataItem, FormatExportedDataItem]>

export type CreateStudy = (study: Study) => Promise<void>
