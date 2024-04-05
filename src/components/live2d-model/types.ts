import type { Live2DModelMotionManager } from '@/types/live2d'
// pixi is `devDependencies`, because just use it's types.
import type { Application } from 'pixi.js'

export type Live2DHitAreas = string[]

export enum MotionPriority {
  /** none priority */
  NONE,
  /** low priority */
  IDLE,
  /** mid priority */
  NORMAL,
  /** high priority */
  FORCE,
}

export interface Live2DCoreModel {
  setParameterValueById(param: string, value: number, weight?: number): void
}

export interface Live2DInternalModel {
  coreModel: Live2DCoreModel
  motionManager: Live2DModelMotionManager
  update(): void
}

export interface Live2DModel {
  scale: {
    set(n: number): void
  }
  internalModel: Live2DInternalModel
  on(event: string, handler: (hitAreas: Live2DHitAreas) => void): void
  emit(event: string, hitAreas: Live2DHitAreas): void
  // If not param mtn, then random trigger a motion.
  motion(mtn?: string, index?: number, priority?: MotionPriority): void
  // If not param exp, then random trigger a expression.
  expression(exp?: string): void
  destroy(): void
}

export interface Live2DCreatePixiAppOptions {
  /** Render element */
  view: HTMLElement
  /** Background transparent */
  transparent: boolean
  /** Whether force use WebGL */
  forceWebGL: boolean
  /** Whether auto adjusting the resolution */
  autoDensity: boolean
  /** Set render resolution */
  resolution: number
}

export interface Live2DPixiApp {
  stage: {
    addChild: (model: Live2DModel) => void
  }
}

export interface Live2DCreatePixiApp {
  (): Application
}

export interface Live2DCreateModel {
  (PixiApp: Application): Promise<Live2DModel>
}

export interface Live2DModelHit {
  (model: Live2DModel, hitAreas: Live2DHitAreas): void
}

export interface Live2DModelProps {}

export interface Live2DModelMethods extends Omit<Live2DModel, 'scale' | 'on'> {}
