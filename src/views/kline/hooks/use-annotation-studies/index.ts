import { Study, CHART_STUDIES, StudyName, StudyFullname } from '@/config/kline'
import { useKLineCreate } from '@/views/kline/hooks/use-kline'
import { useAnnotations } from '../use-annotation'

import type { GetLastFn, UseAnnotationStudies } from './types'

/**
 * Create study with annotation.
 */
export const useAnnotationStudies: UseAnnotationStudies = (clickListeners) => {
  const {
    onForksClick,
    onDivergenceClick,
    onOverBoughtSoldClick,
    onPressureSupportClick,
  } = clickListeners ?? {}
  const { chart, getChartData, findStudy } = useKLineCreate()
  const {
    createForks,
    createPressureSupport,
    createOverBoughtSold,
    createDivergence,
    handleShapeClick,
  } = useAnnotations({
    onForksClick,
    onDivergenceClick,
    onOverBoughtSoldClick,
    onPressureSupportClick,
  })
  const creators = {
    vol: () => createStudy(CHART_STUDIES[StudyName.VOL]),
    ma: () => createStudy(CHART_STUDIES[StudyName.MA]),
    ema: () => createStudy(CHART_STUDIES[StudyName.EMA]),
    boll: () => createStudy(CHART_STUDIES[StudyName.BOLL]),
    wr: () => createStudy(CHART_STUDIES[StudyName.WR], false),
    macd: () => createStudy(CHART_STUDIES[StudyName.MACD], false),
    rsi: () => createStudy(CHART_STUDIES[StudyName.RSI], false),
  }

  const createStudy = (study: Study, needClear = true) => {
    return new Promise((resolve, reject) => {
      chart?.onChartReady(async () => {
        try {
          const activeChart = chart?.activeChart()
          const isExisted = findStudy(study.name as StudyFullname)
          const allStudies = activeChart.getAllStudies()
          const allShapes = activeChart.getAllShapes()

          if (needClear) {
            activeChart.removeAllShapes()
            allShapes.forEach(({ id }) => {
              activeChart.removeEntity(id, { disableUndo: true })
            })
          }

          if (isExisted) {
            allStudies.forEach(({ id }) =>
              activeChart.getStudyById(id).setVisible(true)
            )
            resolve(false)
            return
          }

          await activeChart?.createStudy(
            study.name,
            study.isMain,
            false, // Unlock on testing.
            study.inputs,
            study.overrides,
            study.options
          )

          resolve(true)
        } catch (error) {
          reject(`[createStudy Error]: ${error}`)
        }
      })
    })
  }

  const hiddenStudy = (studyNames: StudyName | StudyName[]) => {
    setTimeout(() => {
      studyNames = Array.isArray(studyNames) ? studyNames : [studyNames]
      const activeChart = chart?.activeChart()

      if (!activeChart) return
      const studies = activeChart.getAllStudies()

      studyNames.forEach((name) => {
        studies.forEach((study) => {
          if (study.name !== name) return

          const s = activeChart.getStudyById(study.id)
          s.isVisible() && s.setVisible(false)
        })
      })
    })
  }

  // Get last element from dataGetter.
  const getLast: GetLastFn = (dataGetter) => {
    return new Promise(async (resolve, reject) => {
      const [first, second] = await dataGetter([[], []] as any)

      if (!first.length || !second.length) reject('[getLast]: Array is Empty')

      const firstLast = first[first.length - 1]
      const secondLast = second[second.length - 1]

      resolve([firstLast, secondLast])
    })
  }

  // Create volume
  const createVOL = async () => {
    await creators.vol()
  }

  // Create MA study and annotation golden/death cross.
  const createMA = async (isEMA = false) => {
    await (isEMA ? creators.ema() : creators.ma())

    const [golden, death] = await getLast(async (tuple) => {
      await getChartData((data) => {
        const { Crosses, Short, Long } = data

        if (Number.isNaN(Crosses) || !Crosses) return
        if (Short > Long) {
          tuple[0].push(data)
        } else {
          tuple[1].push(data)
        }
      })

      return tuple
    })
    const studyName = isEMA ? 'EMA' : 'MA'
    const ownerId = findStudy(StudyName.MA)?.id

    createForks([
      {
        time: golden.time,
        price: golden.Crosses,
        studyName,
        ownerId,
      },
      {
        time: death.time,
        price: death.Crosses,
        studyName,
        ownerId,
      },
    ])

    hiddenStudy(isEMA ? StudyName.EMA : StudyName.MA)
  }

  // Create EMA study, it's also MA.
  const createEMA = async () => {
    await createMA(true)
  }

  // Create bollinger study.
  const createBOLL = async () => {
    await creators.boll()

    const [first] = await getLast(async (tuple) => {
      await getChartData((data, i, rawData) => {
        if (i !== rawData.data.length - 1) return

        tuple[0].push(data)
        tuple[1].push(data)
      })

      return tuple
    })
    const studyName = 'BOLL'
    const ownerId = findStudy(StudyName.BOLL)?.id

    createPressureSupport([
      {
        time: first.time,
        price: first.Upper,
        studyName,
        ownerId,
      },
      {
        time: first.time,
        price: first.Lower,
        studyName,
        ownerId,
      },
    ])

    hiddenStudy(StudyName.BOLL)
  }

  // Create WR study.
  const createWR = async () => {
    await creators.wr()
    await getChartData((data, i, rawData) => {
      const absPlot = Math.abs(data.Plot)
      const studyName = 'WR'
      const ownerId = findStudy(StudyName.WR)?.id!

      if (i !== rawData.data.length - 1) return
      if (absPlot >= 0 && absPlot <= 20) {
        createOverBoughtSold('bought', {
          time: data.time,
          price: data.Plot,
          studyName,
          ownerId,
        })
      } else if (absPlot >= 80 && absPlot <= 100) {
        createOverBoughtSold('sold', {
          time: data.time,
          price: data.Plot,
          studyName,
          ownerId,
        })
      }
    })
  }

  // Create MACD study and annotation.
  const createMACD = async () => {
    const studyName = 'MACD'

    await creators.macd()
    macdForks(studyName)
    macdDivergence(studyName)
  }

  // MACD golden/death cross.
  const macdForks = async (studyName: string) => {
    const [first, second] = await getLast(async (tuple) => {
      // MACD doesn't have Crosses field, but after golden cross, next time must be death cross.
      // So, we can use a value to reverse the judgment, help to judge golden/death cross.
      // This judgment is more reliable than judging Histogram whether is close to 0.
      let trigger = true
      await getChartData((data) => {
        const { MACD, Signal } = data

        if (MACD >= Signal && trigger) {
          trigger = false
          tuple[0].push(data)
        } else if (MACD <= Signal && !trigger) {
          trigger = true
          tuple[1].push(data)
        }
      })
      return tuple
    })
    const ownerId = findStudy(StudyName.MACD)?.id
    const golden = {
      time: first.time,
      price: first.low,
      studyName,
    }
    const death = {
      time: second.time,
      price: second.low,
      studyName,
    }

    createForks([golden, death])
    createForks([
      { ...golden, price: first.MACD, ownerId },
      { ...death, price: second.MACD, ownerId },
    ])
  }

  // MACD divergence.
  const macdDivergence = async (studyName: string) => {
    const [first, second] = await getLast(async (tuple) => {
      await getChartData((data, i) => {
        const { Histogram, MACD, Signal } = data

        if (Math.abs(Histogram) <= 0.3 && MACD > Signal) {
          tuple[0].push(data)
        }
        if (Math.abs(Histogram) <= 0.3 && MACD < Signal) {
          tuple[1].push(data)
        }
      })
      return tuple
    })
    const ownerId = findStudy(StudyName.MACD)?.id

    createDivergence([
      {
        time: second.time,
        price: second.MACD,
        studyName,
        ownerId,
      },
      {
        time: first.time,
        price: first.MACD,
        studyName,
        ownerId,
      },
    ])
  }

  // Create RSI study and annotation.
  const createRSI = async () => {
    const studyName = 'RSI'

    await creators.rsi()
    rsiForks(studyName)
    rsiDivergence(studyName)
    rsiOverBoughtSold(studyName)
  }

  // RSI golden/death cross.
  const rsiForks = async (studyName: string) => {
    const [first, second] = await getLast(async (tuple) => {
      let trigger = true

      await getChartData((data) => {
        if (data.Plot > data['Smoothed MA'] && trigger) {
          trigger = false
          tuple[0].push(data)
        } else if (data.Plot < data['Smoothed MA'] && !trigger) {
          trigger = true
          tuple[1].push(data)
        }
      })

      return tuple
    })

    const ownerId = findStudy(StudyName.RSI)?.id
    const golden = {
      time: first.time,
      price: first.low,
      studyName,
    }
    const death = {
      time: second.time,
      price: second.low,
      studyName,
    }

    createForks([golden, death])
    createForks([
      {
        ...golden,
        time: first.time,
        price: first.Plot,
        ownerId,
      },
      {
        ...death,
        time: second.time,
        price: second.Plot,
        ownerId,
      },
    ])
  }

  // RSI divergence.
  const rsiDivergence = async (studyName: string) => {
    const [first, second] = await getLast(async (tuple) => {
      let lastRSI = 0

      await getChartData((data) => {
        const { open, close } = data
        const slowLine = data['Smoothed MA']

        if (close < open && slowLine > lastRSI) {
          lastRSI = slowLine
          tuple[0].push(data)
        } else if (close > open && slowLine > lastRSI) {
          lastRSI = slowLine
          tuple[1].push(data)
        }
      })

      return tuple
    })

    const ownerId = findStudy(StudyName.RSI)?.id

    createDivergence([
      {
        time: first.time,
        price: first['Smoothed MA'],
        ownerId,
        studyName,
      },
      {
        time: second.time,
        price: second['Smoothed MA'],
        ownerId,
        studyName,
      },
    ])
  }

  // RSI overbuy/oversell
  const rsiOverBoughtSold = async (studyName: string) => {
    await getChartData((data, i, rawData) => {
      const { Plot, time, high, low } = data

      if (i !== rawData.data.length - 1) return

      const ownerId = findStudy(StudyName.RSI)?.id
      const overbought = {
        time,
        price: high,
        studyName,
      }
      const oversold = {
        time,
        price: low,
        studyName,
      }

      if (Plot >= 70) {
        createOverBoughtSold('bought', {
          ...overbought,
          price: Plot,
          ownerId,
        })
      } else if (Plot <= 30) {
        createOverBoughtSold('sold', {
          ...oversold,
          price: Plot,
          ownerId,
        })
      }
    })
  }

  // Create KDJ study
  const createKDJ = async () => {}

  // Create stochRSI study
  const createStochRSI = async () => {}

  return {
    createVOL,
    createMA,
    createEMA,
    createBOLL,
    createWR,
    createMACD,
    createRSI,
    createKDJ,
    createStochRSI,
    hiddenStudy,
    hiddenAllStudy: () => hiddenStudy(Object.values(StudyName)),
    handleShapeClick,
  }
}
