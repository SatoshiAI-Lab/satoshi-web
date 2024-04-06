import modelJson from '../../../public/live2d/satoshi/model.json'

import type { Live2DModel } from '@/components/live2d-model/types'
import type {
  UseLipSyncOptions,
  UseLipSyncOverrideOptions,
} from '@/hooks/use-lip-sync'
import type { ChatResponseAnswerMeta } from '@/api/chat/types'
import type { EnumToObject } from '@/types/types'

export const {
  Sounds,
  FileReferences: { Motions, Expressions },
} = modelJson

export const motions = (Object.keys(Motions) as []).reduce(
  (p, m) => ((p[m] = m), p),
  {} as Record<ModelMotions, ModelMotions>
)

export const expressions = (
  Expressions.map((e) => e.Name) as ModelExpressions[]
).reduce(
  (p, e) => ((p[e] = e), p),
  {} as Record<ModelExpressions, ModelExpressions>
)

type ModelMotions = keyof typeof Motions

export enum ModelExpressions {
  'default' = 'default',
  'white-clothes' = 'white-clothes',
  'white-sunglasses' = 'white-sunglasses',
  'black-sunglasses' = 'black-sunglasses',
}

export interface States {
  model: Live2DModel | null
  modelEl: HTMLCanvasElement | null
  motions: typeof motions
  expressions: EnumToObject<typeof ModelExpressions>
  sounds: typeof Sounds
  showWelcome: boolean
  isMute: boolean
  lastWisdomTimer: NodeJS.Timeout | undefined
  lastSpeakClearer: () => void
  lastResetMotionTimer: NodeJS.Timeout | undefined
  lastDelayTimer: NodeJS.Timeout | undefined
}

export interface Actions {
  setModel(model: Live2DModel): void
  setModelEl(el: HTMLCanvasElement | null): void
  setModelConfig(
    config: {
      x?: number
      y?: number
    },
    scale?: number
  ): void
  setShowWelcome(show: boolean): void
  randomMotion(): void
  resetMotion(): void
  resetExpression(): void
  speak(
    path: string,
    options?: {
      opts?: UseLipSyncOptions
      overrideOpts?: UseLipSyncOverrideOptions
    }
  ): void
  randomSpeakWisdom(): void
  handleEmotion(emotion?: ChatResponseAnswerMeta['emotion']): void
  speakAndMotion(
    motion?: keyof typeof Sounds.motions,
    shouldReset?: boolean
  ): Promise<void>
  setIsMute(isMute: boolean): void
}
