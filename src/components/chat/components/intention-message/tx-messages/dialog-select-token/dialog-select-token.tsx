import { DialogHeader } from '@/components/dialog-header'
import {
  Dialog,
  DialogContent,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IoSearchOutline } from 'react-icons/io5'

interface Props {
  show: boolean
  open: () => any
  hidden: () => any
}

export const DialogSelectToken = (props: Props) => {
  const { show, hidden } = props
  const { t } = useTranslation()

  return (
    <Dialog open={show} onClose={hidden}>
      <DialogHeader
        text={<span className="text-lg">{t('select.token')}</span>}
        onClose={hidden}
        textAlign="left"
      ></DialogHeader>
      <DialogContent>Coming soon</DialogContent>
      {/* <div>
        <div className="px-6">
          <OutlinedInput
            placeholder="Search name or paste address"
            className="w-[350px] py-1"
            size="small"
            startAdornment={
              <IoSearchOutline size={25} className="mr-2"></IoSearchOutline>
            }
          ></OutlinedInput>
        </div>
        <div className="px-6 mt-4 pt-2 border-t border-gray-300">
          <div className="flex">
            <span className="text-lg">My tokens in</span>
            <Select className="">
              <MenuItem></MenuItem>
            </Select>
          </div>
        </div>
      </div> */}
    </Dialog>
  )
}
