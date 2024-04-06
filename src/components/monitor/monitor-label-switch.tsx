import { Switch } from '@mui/material'
import { IoSettingsOutline } from 'react-icons/io5'

interface Props {
  data: any
  onSwitch?: any
  isShowSetting?: boolean
}

export const MonitorLabelSwitch = ({
  data,
  onSwitch,
  isShowSetting,
}: Props) => {
  return (
    <div className="flex justify-between rounded-lg border border-black pl-2 pr-1 min-w-[200px]">
      <div className="flex items-center">
        <img src={data.logo} alt="Logo" width={22} />
        <span className="ml-2">{data.name}</span>
      </div>
      <div className="flex items-center ml-3">
        {data.setting && isShowSetting && (
          <IoSettingsOutline
            onClick={onSwitch}
            className="mr-1 cursor-pointer"
          ></IoSettingsOutline>
        )}
        <Switch></Switch>
      </div>
    </div>
  )
}
