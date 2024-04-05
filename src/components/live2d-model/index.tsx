import React, { useEffect, useRef, memo } from 'react'
import clsx from 'clsx'

import { LIVE2D_CONFIG } from '@/config/live2d'
import { useResponsive } from '@/hooks/use-responsive'
import { useMobileKeyboard } from '@/hooks/use-mobile-keyboard'
import { useLive2DStore } from '@/stores/use-live2d-store'
import { useDebounce } from '@/hooks/use-debounce'

import type { Live2DCreatePixiApp, Live2DCreateModel } from './types'
import { useStorage } from '@/hooks/use-storage'

interface Live2dModelProps extends React.ComponentProps<'div'> {}

// Don't separately export, because default export have memo.
const Live2DModel = (props: Live2dModelProps) => {
  const { className = '' } = props
  const modelRef = useRef(null)
  const { isMobile } = useResponsive()
  const isShowKeyboard = useMobileKeyboard()
  const {
    model,
    showWelcome,
    setIsMute,
    setModel,
    setModelEl,
    setShowWelcome,
    setModelConfig,
    speakAndMotion,
    randomSpeakWisdom,
  } = useLive2DStore()
  const randomWisdom = useDebounce(randomSpeakWisdom, 300)
  const { getIsMuted } = useStorage()

  const createPixiApp: Live2DCreatePixiApp = () => {
    // @ts-ignore
    return new PIXI.Application({
      view: modelRef.current!,
      transparent: true,
      width: 800,
      height: 800,
      // Below can make render more clear
      forceWebGL: true,
      autoDensity: true,
      resolution: window.devicePixelRatio * 2,
    })
  }

  const createModel: Live2DCreateModel = (PixiApp) => {
    // @ts-ignore
    return PIXI.live2d.Live2DModel.from(LIVE2D_CONFIG.modelPath).then(
      async (model: any) => {
        setModel(model)
        setModelEl(modelRef.current!)
        setConfig()
        showWelcome && speakAndMotion('Welcome')
        setShowWelcome(false)
        PixiApp.stage.addChild(model)

        return model
      }
    )
  }

  const setConfig = () => {
    const { mobile, desktop } = LIVE2D_CONFIG

    setModelConfig(
      isMobile ? mobile.config : desktop.config,
      isMobile ? mobile.scale : desktop.scale
    )
  }

  useEffect(() => {
    createModel(createPixiApp())

    return () => model?.destroy()
  }, [])

  useEffect(() => {
    model && setConfig()
  }, [isMobile])

  useEffect(() => {
    if (!model || !isMobile) return

    const { mobile, mobileKeyboarShow } = LIVE2D_CONFIG
    Object.assign(model, isShowKeyboard ? mobileKeyboarShow : mobile.config)
  }, [isShowKeyboard])

  // Get cached model mute status.
  useEffect(() => {
    setIsMute(getIsMuted() == 'true')
  }, [])

  return (
    <>
      <canvas
        className={clsx(
          'fixed bottom-0 left-0 z-10 !cursor-pointer',
          className
        )}
        ref={modelRef}
        onClick={randomWisdom}
        onTouchEnd={randomWisdom}
      ></canvas>
    </>
  )
}

export default memo(Live2DModel)
