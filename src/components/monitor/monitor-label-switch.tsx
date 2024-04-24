import { Switch } from '@mui/material'
import { clsx } from 'clsx'
import { IoSettingsOutline } from 'react-icons/io5'

interface Base {
  subscribed: boolean
  chain?: string
  name?: string
  logo?: string
  [k: string]: any
}

interface Props<T> {
  data: T
  disabled?: boolean
  logo?: string
  onSwitch: (checked: boolean, data: T) => void
  onSetting?: ((data: T) => void) | null
}

export const MonitorLabelSwitch = <T extends Base>({
  data,
  logo,
  disabled,
  onSwitch,
  onSetting,
}: Props<T>) => {
  return (
    <div
      className={clsx(
        'flex justify-between rounded-lg border border-black',
        'pl-2 pr-1 min-w-[220px] dark:border-zinc-500'
      )}
    >
      <div className="flex items-center">
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
        {data.subscribed && onSetting && (
          <IoSettingsOutline
            onClick={() => onSetting(data)}
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
