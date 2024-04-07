import { MonitorConfigData, MonitorParam } from '@/api/monitor/type'

export interface States {
  configData?: MonitorConfigData
}

export interface Actions {
  update: () => Promise<void>
  setConfig: (data: MonitorParam) => Promise<void>
  timerByUpdate: (data?: MonitorConfigData) => void
}
