import { Switch } from '@mui/material'
import { IoSettingsOutline } from 'react-icons/io5'

interface Props {
  data: any
  onSwitch?: (checked: boolean) => void
  onSetting?: any
}

export const MonitorLabelSwitch = ({ data, onSwitch, onSetting }: Props) => {
  return (
    <div className="flex justify-between rounded-lg border border-black pl-2 pr-1 min-w-[200px]">
      <div className="flex items-center">
        {/* <img src={data.logo} alt="Logo" width={22} /> */}
        <img src={'/images/monitor/monitor.png'} alt="Logo" width={22} />
        <span className="ml-2 text-nowrap">{data.name}</span>
      </div>
      <div className="flex items-center ml-3">
        {data.slug && onSetting && (
          <IoSettingsOutline
            onClick={onSetting}
            className="mr-1 cursor-pointer"
          ></IoSettingsOutline>
        )}
        <Switch
          checked={data.subscribed}
          onChange={(_, checked) => onSwitch?.(checked)}
        ></Switch>
      </div>
    </div>
  )
}
