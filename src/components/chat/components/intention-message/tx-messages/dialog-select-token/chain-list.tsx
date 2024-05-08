import clsx from 'clsx'

import { Avatar, Tooltip } from '@mui/material'
import { t } from 'i18next'
import { ContextType, useContext, useRef, MouseEvent, WheelEvent } from 'react'
import { DialogContext } from '@/hooks/use-swap/use-dialog-select-token'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import 'react-horizontal-scrolling-menu/dist/styles.css'

type scrollVisibilityApiType = ContextType<typeof VisibilityContext>

export const ChainList = () => {
  const {
    tokenChain,
    selectChainId,
    setSelectChainId,
    isNameSearch,
    isSearch,
  } = useContext(DialogContext)

  // NOTE: for drag by mouse
  const dragState = useRef(new DragDealer())

  if (tokenChain.length < 2 || (!isNameSearch && isSearch)) {
    return <></>
  }

  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: MouseEvent) =>
      dragState.current.dragMove(ev, (posDiff: number) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff
        }
      })

  return (
    <div className="max-w-[400px]" onMouseLeave={dragState.current.dragStop}>
      <ScrollMenu
        onMouseDown={() => dragState.current.dragStart}
        onMouseUp={() => dragState.current.dragStop}
        onWheel={onWheel}
        onMouseMove={handleDrag}
      >
        <div className="mt-2 pb-2 px-6 flex">
          <Avatar
            className={clsx(
              '!w-[35px] !h-[35px] mr-2 !bg-black cursor-pointer border-[3px]',
              selectChainId === '-1' ? '!border-blue-700' : '!border-white'
            )}
            onClick={() => setSelectChainId('-1')}
          >
            <span className="!text-sm">{t('all')}</span>
          </Avatar>
          {tokenChain.map((chain, i) => {
            return (
              <Tooltip
                key={i}
                title={chain.name}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -10],
                        },
                      },
                    ],
                  },
                }}
              >
                <div
                  className={clsx(
                    'cursor-pointer w-[35px] h-[35px] rounded-lg object-cover border-[3px]',
                    chain.id == selectChainId
                      ? 'border-blue-700'
                      : 'border-white',
                    tokenChain.length - 1 !== i ? 'mr-2' : ''
                  )}
                  style={{
                    backgroundImage: `url(${chain.logo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                  onClick={() => setSelectChainId(chain.id)}
                ></div>
              </Tooltip>
            )
          })}
        </div>
      </ScrollMenu>
    </div>
  )
}

export class DragDealer {
  clicked: boolean
  dragging: boolean
  position: number

  constructor() {
    this.clicked = false
    this.dragging = false
    this.position = 0
  }

  public dragStart = (ev: MouseEvent) => {
    this.position = ev.clientX
    this.clicked = true
  }

  public dragStop = () => {
    window.requestAnimationFrame(() => {
      this.dragging = false
      this.clicked = false
    })
  }

  public dragMove = (ev: MouseEvent, cb: (posDiff: number) => void) => {
    const newDiff = this.position - ev.clientX

    const movedEnough = Math.abs(newDiff) > 5

    if (this.clicked && movedEnough) {
      this.dragging = true
    }

    if (this.dragging && movedEnough) {
      this.position = ev.clientX
      cb(newDiff)
    }
  }
}

function onWheel(apiObj: scrollVisibilityApiType, ev: WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15

  if (isThouchpad) {
    ev.stopPropagation()
    return
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext()
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev()
  }
}
