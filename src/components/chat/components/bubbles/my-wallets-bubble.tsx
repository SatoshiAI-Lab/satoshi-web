import React, { useState } from 'react'
import { IoMdWallet } from 'react-icons/io'
import MessageBubble from './message-bubble'
import {
  Avatar,
  Button,
  ClickAwayListener,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'

import { utilFmt } from '@/utils/format'
import clsx from 'clsx'

const rows = [
  {
    id: 123123,
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    name: 'CATWTF',
    chain: 'Solana',
    chainAvatar: 'https://mui.com/static/images/avatar/1.jpg',
    value: 41312321,
    balance: 12312,
    price: 0.0000051,
  },
  {
    id: 7891729381,
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    name: 'CATWTF',
    chain: 'Solana',
    chainAvatar: 'https://mui.com/static/images/avatar/1.jpg',
    value: 41312321,
    balance: 12312,
    price: 0.0000051,
  },
  {
    id: 7128379182421,
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    name: 'CATWTF',
    chain: 'Solana',
    chainAvatar: 'https://mui.com/static/images/avatar/1.jpg',
    value: 41312321,
    balance: 12312,
    price: 0.0000051,
  },
]

const MyWalletsBubble = () => {
  return (
    <MessageBubble>
      <WalletTable name="wallet 1" balance={123} />
      <Divider classes={{ root: '!border-gray-300 !mt-3 !mb-4' }} />
      <WalletTable name="wallet 2" balance={456} />
    </MessageBubble>
  )
}

const WalletTable = (props: { name: string; balance: number }) => {
  const { name, balance } = props
  const [selectId, setSelectId] = useState(-1)

  const cellCls = (i: number, ...inputs: Parameters<typeof clsx>) => {
    return clsx(
      // '!text-base',
      i === rows.length - 1 ? '!border-b-transparent' : '',
      ...inputs
    )
  }

  const onRowClick = (row: (typeof rows)[number]) => {
    setSelectId(row.id)
    console.log('click', row)
  }

  const onDetails = (row: (typeof rows)[number]) => {
    console.log('onDetails click', row)
  }

  const onBuy = (row: (typeof rows)[number]) => {
    console.log('onBuy click', row)
  }

  const onSell = (row: (typeof rows)[number]) => {
    console.log('onSell click', row)
  }

  return (
    <>
      <div className="flex items-center mb-2">
        <IoMdWallet size={28} className="text-primary" />
        <div className="ml-2 font-bold text-lg">
          {name} · ${balance}
        </div>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell classes={{ root: '!pl-0 !text-gray-400' }}>
              ASSET
            </TableCell>
            <TableCell classes={{ root: '!text-gray-400' }}>VALUE</TableCell>
            <TableCell classes={{ root: '!text-gray-400' }}>BALANCE</TableCell>
            <TableCell classes={{ root: '!text-gray-400' }}>PRICE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <ClickAwayListener
              onClickAway={() => {
                if (r.id !== selectId) return
                setSelectId(-1)
              }}
            >
              <Tooltip
                title={
                  <div className="flex">
                    <Button size="small" onClick={() => onDetails(r)}>
                      Details
                    </Button>
                    <Button
                      size="small"
                      classes={{ root: '!mx-2' }}
                      onClick={() => onBuy(r)}
                    >
                      Buy
                    </Button>
                    <Button size="small" onClick={() => onSell(r)}>
                      Sell
                    </Button>
                  </div>
                }
                classes={{
                  tooltip: '!bg-white !border border-gray-300 !mt-0',
                  arrow: clsx(
                    'before:!bg-white before:!border before:border-gray-300',
                    '!translate-x-5'
                  ),
                }}
                arrow
                placement="bottom-start"
                PopperProps={{ disablePortal: true }}
                open={selectId === r.id}
                onClose={() => setSelectId(-1)}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <TableRow
                  key={r.id}
                  classes={{
                    root: clsx(
                      '!cursor-pointer !h-[61px]',
                      selectId === r.id && '!bg-gray-100'
                    ),
                  }}
                  onClick={() => onRowClick(r)}
                >
                  <TableCell classes={{ root: cellCls(i, '!pl-0') }}>
                    <div className="flex items-stretch ">
                      <Avatar src={r.avatar} sx={{ width: 45, height: 45 }} />
                      <div className="flex flex-col justify-between ml-2">
                        <span className="text-primary">{r.name}</span>
                        <div className="flex items-center">
                          <Avatar
                            src={r.chainAvatar}
                            sx={{ width: 20, height: 20 }}
                          />
                          <span className="text-gray-500 ml-1">{r.chain}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell classes={{ root: cellCls(i) }}>
                    ${r.value}
                  </TableCell>
                  <TableCell classes={{ root: cellCls(i) }}>
                    {r.balance}K
                  </TableCell>
                  <TableCell classes={{ root: cellCls(i) }}>
                    ${utilFmt.token(r.price)}
                  </TableCell>
                </TableRow>
              </Tooltip>
            </ClickAwayListener>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default MyWalletsBubble
