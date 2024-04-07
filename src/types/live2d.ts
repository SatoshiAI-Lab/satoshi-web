export interface Live2DModelMotionManager {
  _events: Events
  _eventsCount: number
  motionGroups: { [key: string]: Definition[] }
  state: State
  playing: boolean
  destroyed: boolean
  settings: Settings
  tag: string
  groups: Groups
  motionDataType: string
  queueManager: QueueManager
  definitions: { [key: string]: Definition[] }
  eyeBlinkIds: any[]
  lipSyncIds: string[]
  expressionManager: ExpressionManager
}

export interface Events {}

export interface Definition {
  File: string
}

export interface ExpressionManager {
  _events: Events
  _eventsCount: number
  expressions: any[]
  reserveExpressionIndex: number
  destroyed: boolean
  settings: Settings
  tag: string
  queueManager: QueueManager
  definitions: Ion[]
  defaultExpression: TExpression
  currentExpression: TExpression
}

export interface TExpression {
  _fadeInSeconds: number
  _fadeOutSeconds: number
  _weight: number
  _offsetSeconds: number
  _firedEventValues: any[]
  _parameters: any[]
}

export interface Ion {
  Name: Name
  File: File
}

export type File =
  | 'expressions/white-clothes.exp3.json'
  | 'expressions/white-sunglasses.exp3.json'
  | 'expressions/black-sunglasses.exp3.json'
  | 'expressions/default.exp3.json'

export type Name =
  | 'white-clothes'
  | 'white-sunglasses'
  | 'black-sunglasses'
  | 'default'

export interface QueueManager {
  _userTimeSeconds: number
  _eventCustomData: null
  _motions: any[]
}

export interface Settings {
  json: JSON
  url: string
  name: string
  groups: Group[]
  hitAreas: any[]
  moc: string
  expressions: Ion[]
  motions: { [key: string]: Definition[] }
  textures: string[]
}

export interface Group {
  Target: string
  Name: string
  Ids: string[]
}

export interface JSON {
  Version: number
  FileReferences: FileReferences
  Groups: Group[]
  HitAreas: any[]
  Audios: string[]
  url: string
}

export interface FileReferences {
  Moc: string
  Textures: string[]
  DisplayInfo: string
  Expressions: Ion[]
  Motions: { [key: string]: Definition[] }
}

export interface Groups {
  idle: string
}

export interface State {
  debug: boolean
  currentPriority: number
  reservePriority: number
  tag: string
}
