import { create } from 'zustand'
import i18n from 'i18next'

import { useRandom } from '@/hooks/use-random'
import { MotionPriority } from '@/components/live2d-model/types'
import { useLipSync } from '@/hooks/use-lip-sync'
import { motions, expressions, Sounds } from './types'
import { LIVE2D_CONFIG } from '@/config/live2d'

import type { States, Actions } from './types'

export const useLive2DStore = create<States & Actions>((set, get) => ({
  model: null,
  modelEl: null,
  showWelcome: true,
  motions,
  expressions,
  sounds: Sounds,
  isMute: false,
  lastWisdomTimer: undefined,
  lastResetMotionTimer: undefined,
  lastDelayTimer: undefined,

  lastSpeakClearer: () => {},
  setIsMute: (isMute) => set({ isMute }),
  setModel: (model) => set({ model }),
  setModelEl: (modelEl) => set({ modelEl }),
  setShowWelcome: (showWelcome) => set({ showWelcome }),
  setModelConfig(config, scale) {
    const { model } = get()

    if (!model) return
    if (scale) model?.scale?.set(scale)

    Object.assign(model, config)
  },
  randomMotion() {
    const { model, motions } = get()
    if (!model) return

    const notWelcomeDefault = Object.values(motions).filter(
      (m) => m !== 'Welcome' && m !== 'Default'
    )
    const getMotion = useRandom(notWelcomeDefault)

    model.motion(getMotion(), 0, MotionPriority.FORCE)
  },
  resetMotion() {
    get().model?.motion('Default', 0, MotionPriority.FORCE)
  },
  resetExpression() {
    get().model?.expression('default')
  },
  speak(path, opts) {
    const {
      model,
      isMute,
      lastWisdomTimer,
      lastResetMotionTimer,
      lastDelayTimer,
      lastSpeakClearer,
    } = get()
    if (!model || isMute) return

    const stop = useLipSync(model, opts?.opts)(
      path.replace(LIVE2D_CONFIG.audioLangKey, i18n.language),
      opts?.overrideOpts
    )
    clearTimeout(lastWisdomTimer)
    clearTimeout(lastResetMotionTimer)
    clearTimeout(lastDelayTimer)
    lastSpeakClearer()
    set({ lastSpeakClearer: stop })
  },
  randomSpeakWisdom() {
    const { sounds, speak } = get()

    const getWisdom = useRandom(Object.values(sounds.wisdoms))
    speak(getWisdom())
  },

  async handleEmotion(emotion) {
    const { model, randomSpeakWisdom, speakAndMotion } = get()
    if (!emotion || !emotion.trim() || !model) return

    // Natural motions, random select this.
    const naturalMotions = [
      'Smile',
      'Happy',
      'Grinning',
      'Awkward',
      'Ecouragement',
      'Wow',
    ] as const
    // Happy motions, select natural exclude `Awkward`.
    const happyMotions = naturalMotions.filter((m) => m !== 'Awkward')

    // Waiting for 3 seconds, avoiding too frequent.
    set({ lastDelayTimer: setTimeout(handleSleepSpeak, 3000) })

    function handleSleepSpeak() {
      if (emotion === 'natural') {
        // TODO: fix below any type.
        const motion = useRandom<any>(naturalMotions as any)()
        speakAndMotion(motion)
      } else if (emotion === 'happy') {
        const motion = useRandom<any>(happyMotions)()
        speakAndMotion(motion)
      } else {
        speakAndMotion(emotion as any)
      }

      // After 8 seconds, say a wisdom.
      set({ lastWisdomTimer: setTimeout(randomSpeakWisdom, 8000) })
    }
  },
  async speakAndMotion(motion, shouldResetMotion = true) {
    const { model, motions, sounds, speak, resetMotion } = get()

    if (!model || !motion) return
    if (!motions.hasOwnProperty(motion)) return

    // Handle special motion.
    let endMouthValue = 0
    let mouthRadix = 0.3
    if (motion === 'Wow' || motion === 'Encouragement') {
      endMouthValue = 1
    }
    if (motion === 'Encouragement') {
      mouthRadix = 0.8
    }

    speak(sounds.motions[motion], {
      opts: { mouthRadix },
      overrideOpts: { endMouthValue },
    })
    model.motion(motion, 0, 3)
    model.expression()

    // If need reset, get the duration of the animation,
    // and reset manually after the duration.
    if (!shouldResetMotion) return
    const {
      Meta: { Duration },
    } = await import(
      `../../../public/live2d/satoshi/motions/${motion}.motion3.json`
    )
    // Needs save timer, clear prev reset function on next motion trigger,
    // otherwise will cause prev reset function error reset this,
    // which will cause this motion not finish playing when reset.
    set({
      lastResetMotionTimer: setTimeout(resetMotion, Duration * 1000),
    })
  },
}))
