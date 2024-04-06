import React, { useEffect, useState } from 'react'
import clsx from 'clsx'

import StudyDialog from './study-dialog'
import { useDebounce } from '@/hooks/use-debounce'
import { useKLineStore } from '@/stores/use-kline-store'
import { useAnnotationStudies } from '../hooks/use-annotation-studies'
import { KLINE_ANNOTATION, KLINE_STUDIES, StudiesName } from '@/config/kline'

import type { ClickHandlerParams } from '../hooks/use-annotation/types'
import type { EntityId } from '../../../../public/tradingview/charting_library/charting_library'

interface StudiesProps extends React.ComponentProps<'div'> {}

export const Studies: React.FC<StudiesProps> = (props) => {
  const { className = '' } = props
  const { tips } = KLINE_ANNOTATION
  const { chart } = useKLineStore()
  const [actives, setActives] = useState<`${StudiesName}`[]>([])
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [studyName, setStudyName] = useState('')
  const [ownerStudyId, setOwnerStudyId] = useState<EntityId | undefined>()
  const {
    createVOL,
    createMA,
    createEMA,
    createBOLL,
    createWR,
    createMACD,
    createRSI,
    handleShapeClick,
  } = useAnnotationStudies({
    onForksClick: onShapeClick,
    onPressureSupportClick: onShapeClick,
    onOverBoughtSoldClick: onShapeClick,
    onDivergenceClick: onShapeClick,
  })
  // A update may so many data, but update once is enough,
  // So use debounce to update last data.
  // But, make sure this debounce will not be called when component mount.
  const onChartUpdate = useDebounce(() => {
    const studies = chart?.activeChart().getAllStudies()

    studies?.forEach((study) => {
      const name = study.name as `${StudiesName}`

      if (creatorMap[name]) {
        creatorMap[name]()
      }
    })
  })
  const creatorMap = {
    [StudiesName.VOL]: createVOL,
    [StudiesName.MA]: createMA,
    [StudiesName.EMA]: createEMA,
    [StudiesName.BOLL]: createBOLL,
    [StudiesName.WR]: createWR,
    [StudiesName.MACD]: createMACD,
    [StudiesName.RSI]: createRSI,
  }

  const hiddenLegendStudy = () => {
    const iframe = document.querySelector(
      '[id*="tradingview"]'
    ) as HTMLIFrameElement | null
    const wrapper = iframe?.contentDocument?.querySelector(
      '[class*="sourcesWrapper"]'
    ) as HTMLElement | null | undefined

    if (wrapper) {
      wrapper.style.display = 'none'
    }
  }

  function onShapeClick(params: ClickHandlerParams) {
    const {
      text = '',
      type,
      ownerStudyId,
      rawOptions: { studyName = '' },
    } = params

    setOpen(true)
    setTitle(text)
    setContent(tips[type])
    setStudyName(studyName)
    setOwnerStudyId(ownerStudyId)
  }

  const onStudyClick = (study: typeof KLINE_STUDIES.vol) => {
    const { name, isMain, inputs, overrides, options } = study
    const activeChart = chart?.activeChart()
    const allStudies = activeChart?.getAllStudies()

    // Study existed
    if (actives.includes(name)) {
      setActives(actives.filter((n) => n !== name))
      const id = allStudies?.find((s) => s.name === name)?.id ?? ''
      activeChart?.removeEntity(id as EntityId)
      return
    }

    setActives((actives) => [...actives, name])

    // Inexisted, but is sub chart.
    if (!isMain) {
      creatorMap[name]?.()
      return
    }

    // Inexisted, but is main chart.
    activeChart?.createStudy(
      name,
      name === StudiesName.VOL,
      false,
      inputs,
      overrides,
      options
    )
  }

  const onChartReady = async () => {
    await Promise.all([createVOL(), createMA(), createBOLL()])

    const intervalEvent = chart?.activeChart().onIntervalChanged()

    chart?.subscribe('drawing_event', handleShapeClick)
    chart?.subscribe('onTick', onChartUpdate)
    intervalEvent?.subscribe(null, onChartUpdate)
    hiddenLegendStudy()
    setActives([KLINE_STUDIES.vol.name])
  }

  function createStudy() {
    chart?.onChartReady(async () => {
      await createMA()

      const activeChart = chart?.activeChart()
      const data = await activeChart.exportData()
      data.data
        .filter((d) => !Number.isNaN(d[7]))
        .forEach((d) => {
          activeChart.createShape(
            {
              time: d[0],
              price: d[7],
            },
            {
              shape: 'arrow_down',
              text: 'Crosses',
            }
          )
        })

      console.log('data', data)
    })
  }

  useEffect(() => {
    if (!chart) return

    chart.onChartReady(onChartReady)
  }, [chart])

  return (
    <>
      <div
        className={clsx(
          'flex items-center overflow-x-auto overflow-y-hidden',
          className
        )}
      >
        {Object.values(KLINE_STUDIES).map((study, i) => (
          <div
            key={i}
            className={clsx(
              'px-3 border border-solid border-transparent cursor-pointer',
              'transition-all hover:text-gray-600 select-none',
              actives.includes(study.name) ? 'text-balck' : 'text-gray-400',
              study.label === 'BOLL' && 'border-r-gray-300'
            )}
            onClick={() => onStudyClick(study)}
          >
            {study.label}
          </div>
        ))}
      </div>
      <StudyDialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        content={content}
        studyName={studyName}
        ownerStudyId={ownerStudyId}
      />
    </>
  )
}

export default Studies
