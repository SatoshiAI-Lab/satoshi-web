import React, { useState } from 'react'
import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { BsChevronRight } from 'react-icons/bs'
import clsx from 'clsx'

import MessageBubble from '../bubbles/message-bubble'
import { utilArr } from '@/utils/array'
import { useChat } from '@/hooks/use-chat'

import type { IMultiMessage, MultiMessageProps } from './types'
import type { ChatResponseAnswerMetaCoin } from '@/api/chat/types'

function MultiMessage(props: MultiMessageProps) {
  const { id, title, msgs: rawMsgs } = props
  const { addMessageAndLoading, findPrevInteractive, sendMsg } = useChat()
  const [objMsgs, mapMsgs] = utilArr.categorize(rawMsgs, {
    key: 'key',
    assignProps: { checked: false, disabled: false },
  })
  const [msgs, setMsgs] = useState(objMsgs)
  const checkedMap = new Map()

  const formatMsg = (msg: ChatResponseAnswerMetaCoin) => {
    const { alias, name } = msg

    if (!alias || !Array.isArray(alias)) {
      return name
    }

    const uniqueAlias = alias.filter((a) => a !== name)
    const result = uniqueAlias.length ? `（${uniqueAlias.join('、')}）` : ''

    return name + result
  }

  const handleSelected = (arr: IMultiMessage[]) => {
    const { msg } = findPrevInteractive(id) ?? { msg: '' }

    addMessageAndLoading({
      msg,
      position: 'right',
    })

    sendMsg({
      question: msg,
      selected_entities: arr.map(({ type, id }) => ({ type, id })),
    })
  }

  const handleChange = () => {
    if (checkedMap.size !== mapMsgs.size) return

    const [newMsgs] = utilArr.categorize(rawMsgs, {
      key: 'key',
      unique: true,
      assignProps: {
        disabled: true,
      },
    })

    setMsgs(newMsgs)
    handleSelected(Array.from(checkedMap.values()))
  }

  if (!mapMsgs.size) return <></>

  return Object.entries(msgs).map(([key, value], idx) => {
    const tokens = value as IMultiMessage[]

    return (
      <React.Fragment key={idx}>
        {idx === 0 && <MessageBubble>{title}</MessageBubble>}
        <MessageBubble className="pl-3">
          <RadioGroup name={key} onChange={handleChange}>
            {tokens.map((msg, i) => (
              <React.Fragment key={i}>
                <FormControlLabel
                  value={i}
                  classes={{
                    root: '!m-0 gap-1',
                    label: clsx(
                      '!grow hover:text-primary transition-all',
                      msg.disabled ? 'cursor-not-allowed select-none' : ''
                    ),
                  }}
                  control={<Radio size="small" classes={{ root: '!p-1' }} />}
                  disabled={msg.disabled}
                  label={
                    <span className="flex items-center justify-between w-full">
                      <span>{formatMsg(msg)}</span>
                      <BsChevronRight className="shrink-0" />
                    </span>
                  }
                  onChange={() => {
                    if (checkedMap.has(key)) return
                    checkedMap.set(key, msg)
                  }}
                />
                {i !== tokens.length - 1 && (
                  <Divider className="!my-1.5 !border-[#c9c9c9]" />
                )}
              </React.Fragment>
            ))}
          </RadioGroup>
        </MessageBubble>
      </React.Fragment>
    )
  })
}

export default MultiMessage
