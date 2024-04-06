import { MonitorConfigData, MonitorParam } from '@/api/monitor/type'
import { MonitorConfig } from '@/config/monitor'

export interface States {
  configData?: MonitorConfigData
}

export interface Actions {
  update: () => Promise<void>
  setConfig: (data: MonitorParam, rawData:any) => Promise<void>
  timerByUpdate: (data?: MonitorConfigData) => void
}
