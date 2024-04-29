import { useRef } from 'react'

import { useLive2DStore } from '@/stores/use-live2d-store'
import { MotionPriority } from '@/components/live2d-model/types'

import type { ModelMotions } from './../stores/use-live2d-store/types'

/**
 * Live2D main logic hook.
 */
export const useLive2D = () => {
  const timerRef = useRef<number>()
  const { model, speakAndMotion, handleEmotion } = useLive2DStore()

  // Looping a motion.
  const startLoopMotion = (mtn: ModelMotions, interval = 500) => {
    if (!model) return
    if (timerRef.current) stopLoopMotion()

    timerRef.current = window.setInterval(() => {
      model.motion(mtn, 0, MotionPriority.FORCE)
    }, interval)
  }

  // Clear looping.
  const stopLoopMotion = () => {
    clearInterval(timerRef.current)
  }

  // Emit a motion & speak dialogue.
  const emitMotionSpeak = (mtn: ModelMotions) => {
    speakAndMotion(mtn)
  }

  // Emit a motion & random a wisdom.
  const emitMotionWithWisdom = (mtn: ModelMotions) => {
    handleEmotion(mtn)
  }

  return {
    startLoopMotion,
    stopLoopMotion,
    emitMotionSpeak,
    emitMotionWithWisdom,
  }
}
