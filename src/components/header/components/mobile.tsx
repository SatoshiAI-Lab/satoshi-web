import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  SwipeableDrawer,
} from '@mui/material'

import type { HeaderItem } from '../types'

export interface MobileHeaderProps {
  items: string[]
}

function MobileHeader(props: MobileHeaderProps) {
  const { items } = props
  const [open, setOpen] = useState(false)

  const onItemClick = () => {}

  return (
    <>
      <IconButton className="!ml-2" onClick={() => setOpen((open) => !open)}>
        <AiOutlineMenu className="text-black dark:text-white text-2xl" />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        classes={{ paper: 'w-[75vw]' }}
      >
        <div className="flex justify-between items-center pl-3 pr-2 pt-4 pb-2">
          <img
            src="/images/logos/black.png"
            alt="logo"
            className="max-w-logo-m mt-4"
          />
          <IconButton onClick={() => setOpen(false)}>
            <AiOutlineClose size={20} />
          </IconButton>
        </div>
        <List className="!px-2">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <Divider className="!border-gray-300" />
              <ListItemButton
                className="!my-1 !rounded !text-black"
                onClick={onItemClick}
              >
                {item}
              </ListItemButton>
            </React.Fragment>
          ))}
        </List>
      </SwipeableDrawer>
    </>
  )
}

export default MobileHeader
