import { DialogTitle, IconButton } from '@mui/material'
import clsx from 'clsx'
import { IoCloseOutline, IoChevronBack } from 'react-icons/io5'

interface Props extends React.ComponentProps<'div'> {
  text?: JSX.Element
  textAlign?: 'left' | 'center' | 'right'
  textStyle?: string
  onClose: any
  onBack?: any
  closeBtnClass?: string
}

export const DialogHeader = (props: Props) => {
  const {
    text,
    children,
    textAlign = 'center',
    onClose,
    onBack,
  } = props
  return (
    <DialogTitle textAlign={textAlign} className="relative min-w-72">
      {onBack && (
        <div className="absolute top-[50%] left-[25px] translate-y-[-50%] z-10 max-sm:left-[10px]">
          <IconButton onClick={onBack}>
            <IoChevronBack size={22} color="black"></IoChevronBack>
          </IconButton>
        </div>
      )}
      {text && <span>{text}</span>}
      {children && children}
      {onClose && (
        <div className="absolute top-[50%] right-[10px] translate-y-[-50%] z-10">
          <IconButton onClick={onClose}>
            <IoCloseOutline size={26} color="black"></IoCloseOutline>
          </IconButton>
        </div>
      )}
    </DialogTitle>
  )
}
