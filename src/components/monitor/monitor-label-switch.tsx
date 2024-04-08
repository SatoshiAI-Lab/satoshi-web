import { Switch } from '@mui/material'
import { IoSettingsOutline } from 'react-icons/io5'

interface Props {
  data: any
  disabled?: boolean
  logo?: string
  onSwitch: <T>(checked: boolean, data: any) => void
  onSetting?: any
}

export const MonitorLabelSwitch = ({
  data,
  logo,
  disabled,
  onSwitch,
  onSetting,
}: Props) => {
  return (
    <div className="flex justify-between rounded-lg border border-black pl-2 pr-1 min-w-[200px]">
      <div className="flex items-center">
        {/* <img src={data.logo} alt="Logo" width={22} /> */}
        <img
          src={data.logo || logo}
          alt="Logo"
          width={22}
          height={22}
          className="w-[22px] h-[22px] rounded-full object-cover"
        />
        <span className="ml-2 text-nowrap">{data.name ?? data.chain}</span>
      </div>
      <div className="flex items-center ml-3">
        {data.slug && onSetting && (
          <IoSettingsOutline
            onClick={onSetting}
            className="mr-1 cursor-pointer"
          ></IoSettingsOutline>
        )}
        <Switch
          disabled={disabled}
          checked={data.subscribed}
          onChange={(_, checked) => onSwitch?.(checked, data)}
        ></Switch>
      </div>
    </div>
  )
}
