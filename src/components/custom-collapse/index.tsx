import React, { useState } from 'react'
import { Collapse } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IoIosArrowDown } from 'react-icons/io'
import { clsx } from 'clsx'

interface Props extends React.ComponentProps<'div'> {
  minHeight?: number
  arrowSize?: number
  defaultCollapsed?: boolean
  showArrow?: boolean
}

export const CustomCollapse = (props: Props) => {
  const {
    children,
    minHeight,
    arrowSize = 18,
    defaultCollapsed = true,
    showArrow = true,
  } = props
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Collapse
      in={defaultCollapsed ? isCollapsed : true}
      collapsedSize={defaultCollapsed ? minHeight : undefined}
      classes={{ root: '!relative' }}
    >
      {children}
      <div
        className={clsx(
          'absolute bottom-0 left-0 right-0 h-8 backdrop-blur-md',
          'bg-gradient-to-b from-gray-100/50 to-gray-white/50',
          'text-center leading-[2.5rem] text-zinc-600 text-sm',
          'cursor-pointer flex items-center justify-center',
          isCollapsed && 'relative mt-2',
          (!defaultCollapsed || !showArrow) && 'hidden'
        )}
        onClick={() => {
          if (!defaultCollapsed) return
          setIsCollapsed(!isCollapsed)
        }}
      >
        <span>
          {isCollapsed ? t('bubble.show.hide') : t('bubble.show.more')}
        </span>
        <IoIosArrowDown
          className={clsx(
            'ml-2 transition-all duration-300',
            isCollapsed && 'rotate-180'
          )}
          size={arrowSize}
        />
      </div>
    </Collapse>
  )
}

export default CustomCollapse
