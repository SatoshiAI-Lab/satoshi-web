import clsx from 'clsx'

import { ChatResponseTxConfrim, TokenInfo } from '@/api/chat/types'
import { useShow } from '@/hooks/use-show'
import { useTranslation } from 'react-i18next'
import { IoIosArrowDown } from 'react-icons/io'
import { SelectTokenDialog } from './select-token-dialog'

interface Props {
  toTokenList?: TokenInfo[]
  fromTokenList?: TokenInfo[]
  selectFromToken?: TokenInfo
  selectToToken?: TokenInfo
  isBuy: boolean
  isFrom?: boolean
  isFinalTx: boolean
  data: ChatResponseTxConfrim
  switchToken: (token: TokenInfo) => void
}

export const SelectToken: React.FC<Props> = ({
  switchToken,
  toTokenList,
  fromTokenList,
  isBuy,
  selectFromToken,
  selectToToken,
  data,
  isFrom,
  isFinalTx,
}: Props) => {
  console.log(isFrom)

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { t } = useTranslation()
  const { show, open, hidden } = useShow(false)

  const handleClick = (token: TokenInfo) => {
    switchToken(token)
    // setAnchorEl(null)
    hidden()
  }

  const onSwitch = (event: any) => {
    open()

    // setAnchorEl(event.target)
  }

  // const onCloseMenu = () => {
  //   setAnchorEl(null)
  // }

  // const selectOtherToken = () => {
  //   setAnchorEl(null)
  //   open()
  // }

  // const tokenMenu = (tokenList: TokenInfo[]) => (
  //   <Menu
  //     anchorEl={anchorEl}
  //     open={showMenu}
  //     onClose={onCloseMenu}
  //     MenuListProps={{
  //       'aria-labelledby': 'basic-button',
  //     }}
  //   >
  //     {tokenList?.map((item, i) => {
  //       return (
  //         <MenuItem
  //           key={i}
  //           onClick={() => handleClick(item)}
  //           selected={
  //             (isBuy ? selectFromToken : selectToToken)?.chain_name ==
  //             item.chain_name
  //           }
  //         >
  //           <div className="flex flex-col">
  //             <span>{`${item.token_name}`}</span>
  //             <div className="flex items-center">
  //               <span className="text-gray-400 text-sm leading-none">
  //                 {item.chain_name}
  //               </span>
  //             </div>
  //           </div>
  //         </MenuItem>
  //       )
  //     })}
  //     <MenuItem onClick={selectOtherToken}>{t('select.token')}</MenuItem>
  //   </Menu>
  // )

  if (isFrom) {
    return (
      <>
        <div
          className={clsx(
            'h-full cursor-pointer leading-none py-[12px] text-sm border-l-2 text-nowrap pl-3',
            isBuy && 'flex items-center cursor-pointer',
            isFinalTx && 'pointer-events-none'
          )}
          onClick={onSwitch}
        >
          {selectFromToken?.token_name ?? (
            <span className="text-gray-500">{t('select.token')}</span>
          )}
          <IoIosArrowDown className="ml-1 w-[34px]  pointer-events-none"></IoIosArrowDown>
        </div>
        {isBuy ? (
          <SelectTokenDialog show={show} open={open} hidden={hidden} />
        ) : null}
        {/* {tokenMenu(fromTokenList!)} */}
      </>
    )
  }

  return (
    <>
      <div
        className={clsx(
          'border rounded-xl py-[10px] px-6 text-sm',
          !isBuy && 'flex items-center cursor-pointer',
          isFinalTx && 'pointer-events-none'
        )}
        onClick={onSwitch}
      >
        <>
          {selectToToken?.token_name ?? (
            <span className="text-gray-500">{t('select.token')}</span>
          )}
          <IoIosArrowDown className="ml-1"></IoIosArrowDown>
        </>
      </div>
      <SelectTokenDialog show={show} open={open} hidden={hidden} />
    </>
  )
}
