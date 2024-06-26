import { DialogTitle, IconButton } from '@mui/material'
import { IoCloseOutline, IoChevronBack } from 'react-icons/io5'

interface Props extends React.ComponentProps<'div'> {
  text?: React.ReactNode
  textAlign?: 'left' | 'center' | 'right'
  textStyle?: string
  onClose: any
  onBack?: any
  closeBtnClass?: string
}

export const DialogHeader = (props: Props) => {
  const { text, children, textAlign = 'center', onClose, onBack } = props

  return (
    <DialogTitle textAlign={textAlign} className="relative min-w-72">
      {onBack && (
        <div className="absolute top-[50%] left-[25px] translate-y-[-50%] z-10 max-sm:left-[10px]">
          <IconButton onClick={onBack}>
            <IoChevronBack
              size={22}
              className="text-black not-used-dark:text-white"
            />
          </IconButton>
        </div>
      )}
      {text && <span>{text}</span>}
      {children && children}
      {onClose && (
        <div className="absolute top-[50%] right-[10px] translate-y-[-50%] z-10">
          <IconButton onClick={onClose}>
            <IoCloseOutline
              size={26}
              className="text-black not-used-dark:text-white"
            />
          </IconButton>
        </div>
      )}
    </DialogTitle>
  )
}
