import { CHART_STUDIES, StudyName, type Study } from '@/config/kline'
import { useChartStore } from '@/stores/use-chart-store'

import type {
  EntityId,
  IChartingLibraryWidget,
} from '../../../../../public/tradingview/charting_library/charting_library'

/**
 * KLine Study hook, only one create of the same study is allowed.
 */
export const useStudies = () => {
  const studies = Object.values(CHART_STUDIES) as Study[]
  const { chart } = useChartStore()

  /** Waiting for chart ready. */
  const waitingForReady = (newChart?: IChartingLibraryWidget | null) => {
    return new Promise<IChartingLibraryWidget>((resolve, reject) => {
      const chartIns = newChart || chart
      if (!chartIns) {
        return reject('[waitingForReady Error]: chart is null')
      }

      chartIns.onChartReady(() => resolve(chartIns))
    })
  }

  /** Find a study from name. */
  const findStudy = (name: StudyName) => {
    if (!chart) return

    const study = chart
      .activeChart()
      .getAllStudies()
      .find((s) => s.name === name)

    return study
  }

  /** Check a study is existed. */
  const isExisted = (n: StudyName) => !!findStudy(n)

  /** Check a study is not existed. */
  const isNotExisted = (n: StudyName) => !findStudy(n)

  /** Check a study is main chart study. */
  const isMainStudy = (n: StudyName) => !!CHART_STUDIES[n].isMain

  /** Check a study is sub chart study. */
  const isSubStudy = (n: StudyName) => !CHART_STUDIES[n].isMain

  /** Create a study from name. */
  const createStudy = (name: StudyName) => {
    return new Promise<EntityId | null>(async (resolve, reject) => {
      if (!chart) {
        reject('[createStudy Error]: chart is null')
        return
      }
      if (isExisted(name)) {
        reject('[createStudy Error]: study is existed')
        return
      }

      const activeChart = chart.activeChart()
      const studyParams = CHART_STUDIES[name]
      const study = await activeChart.createStudy(
        studyParams.name,
        studyParams.isMain,
        false, // TODO: Use `studyParams.lock` in production mode.
        studyParams.inputs,
        studyParams.overrides,
        studyParams.options
      )

      if (study) resolve(study)
      return reject('[createStudy Error]: created null')
    })
  }

  /** Remove a study from name. */
  const removeStudy = (name: StudyName) => {
    const study = findStudy(name)
    if (!chart || !study) return false

    chart.activeChart().removeEntity(study.id)
  }

  /** Get a existed study visible. */
  const getVisible = (name: StudyName) => {
    const study = findStudy(name)
    if (!chart || !study) return false

    return chart.activeChart().getStudyById(study.id).isVisible()
  }

  /** Set a existed study visible. */
  const setVisible = (name: StudyName, visible: boolean) => {
    const existedStudy = findStudy(name)
    if (!chart || !existedStudy) return false
    const study = chart.activeChart().getStudyById(existedStudy.id)

    study.setVisible(visible)
    return true
  }

  return {
    studies,
    createVOL: () => createStudy(StudyName.VOL),
    createMA: () => createStudy(StudyName.MA),
    createEMA: () => createStudy(StudyName.EMA),
    createBOLL: () => createStudy(StudyName.BOLL),
    createWR: () => createStudy(StudyName.WR),
    createMACD: () => createStudy(StudyName.MACD),
    createRSI: () => createStudy(StudyName.RSI),
    createStudy,
    removeStudy,
    findStudy,
    isExisted,
    isNotExisted,
    isMainStudy,
    isSubStudy,
    getVisible,
    setVisible,
    waitingForReady,
  }
}
