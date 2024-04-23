import React, { useEffect, useState } from 'react'
import { List, ListItemButton, Tooltip } from '@mui/material'
import { HiOutlineChevronDown } from 'react-icons/hi'
import { clsx } from 'clsx'

import type { CustomDropdownProps, CustomDropdownItem } from './types'

export const CustomDropdown = (props: CustomDropdownProps) => {
  const {
    children,
    items,
    active = -1,
    showArrow,
    arrowSize = 20,
    onItemClick,
    onOpen,
    onClose,
  } = props
  const [isFirst, setIsFirst] = useState(true)
  const [open, setOpen] = useState(false)

  const onClickClose = (item: CustomDropdownItem) => {
    setOpen(false)
    onItemClick?.(item)
  }

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false)
      return
    }

    open ? onOpen?.(true) : onClose?.(open)
  }, [open])

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Tooltip
        open={open}
        classes={{ tooltip: '!bg-transparent !mt-0' }}
        title={
          <List className="text-sm !p-1 !rounded-md !shadow-lg">
            {items.map((item) => (
              <ListItemButton
                key={item.key}
                className={clsx(
                  '!rounded-md !mt-1 first:!mt-0 !text-black',
                  'dark:!text-gray-300'
                )}
                selected={item.key === active}
                onClick={() => onClickClose(item)}
              >
                {item.label}
              </ListItemButton>
            ))}
          </List>
        }
      >
        <div
          className={clsx(
            'flex items-center cursor-pointer hover:drop-shadow-bold',
            'dark:hover:drop-shadow-bold-dark'
          )}
        >
          {children}
          {showArrow && (
            <HiOutlineChevronDown
              size={arrowSize}
              className={clsx(
                'transition-all duration-300 text-black dark:text-white',
                open ? 'rotate-180' : ''
              )}
            />
          )}
        </div>
      </Tooltip>
    </div>
  )
}

export default CustomDropdown
