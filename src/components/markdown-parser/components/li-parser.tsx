import React from 'react'
import { Tooltip, Zoom } from '@mui/material'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import { CHAT_CONFIG } from '@/config/chat'

import type { LiProps } from 'react-markdown/lib/ast-to-react'
import type { PPraserProps } from './p-parser'
import type { Element as HElement } from 'hast'

export interface LiParserProps {
  liProps: LiProps | PPraserProps['pProps']
  isListItem?: boolean
}

export interface ReferenceProps {
  id: number
  type: string
  content: string
  published_at: string
  title: string
  url: string
  datetime_str: string
}

function LiParser(props: LiParserProps) {
  const { isListItem = true, liProps } = props
  const {
    answerType: { reference },
    refRule: { refNumber, refElement },
  } = CHAT_CONFIG
  const strChildren = (liProps.node.children as any[])
    .filter((e) => e.tagName !== reference)
    .map((e) => e.value)
    .join('')
  const matchRef = strChildren.match(refNumber)
  const aContent = strChildren
    .replace(refNumber, '')
    .replace(refElement, '')
    .trim()
  const matchRefTag = strChildren.match(refElement)?.[0] ?? ''
  const refList = (liProps.node.children as HElement[]).filter(
    (e) => e.tagName?.toLowerCase() === reference
  ) ?? [{ properties: strToObject(matchRefTag) }]
  const refClass = clsx(
    'underline decoration-dotted cursor-pointer underline-offset-4',
    'hover:text-primary text-black leading-7'
  )

  const refTags = matchRef?.map((e) => Number(e.replace(/\[|\]/g, ''))) ?? []
  const referenceTags = refTags.map((n, i) => (
    <sup
      key={i}
      className={clsx(
        'bg-primary px-1 rounded text-white',
        'no-underline text-xs ml-1'
      )}
    >
      {n}
    </sup>
  ))
  const refTooltips = refList.map((refItem, i) => {
    const properties = refItem.properties as unknown as ReferenceProps
    // MarkdownParser handles links by adding an a tag,
    // which needs to be cleared.
    const url = properties.url?.replace(/<a>|<\/a>/g, '')
    const content = refItem.children.reduce((prev, el) => {
      if (el.type === 'element') {
        prev += '\n'
      } else if (el.type === 'text') {
        prev += el.value
      }
      return prev
    }, '')

    return (
      <div key={i} className={`flex flex-col ${i !== 0 && 'mt-6'}`}>
        <p>type: {withNullText(properties.type)}</p>
        <p>time: {withNullText(properties.published_at)}</p>
        <p className="whitespace-pre-line">content: {content}</p>
        <a
          className={clsx(
            refClass,
            '!text-white hover:!text-primary',
            'hover:!decoration-dotted hover:!underline'
          )}
          target="_blank"
          href={url}
          onClick={(e) => {
            if (!url.trim()) {
              e.preventDefault()
              toast.error('not links')
              return
            }
          }}
        >
          link: {withNullText(url)}
        </a>
      </div>
    )
  })

  function strToObject(str: string) {
    const regex = /(\w+)\s*=\s*"([^"]*)"/g
    const obj: { [k: string]: string } = {}

    let match
    while ((match = regex.exec(str))) {
      const key = match[1]
      const value = match[2]
      obj[key] = value
    }

    return obj
  }

  function withNullText(content: string) {
    return !content?.trim() ? 'null' : content
  }

  return matchRef ? (
    <Tooltip
      arrow
      title={refTooltips}
      classes={{
        tooltip: clsx(
          '!bg-[rgba(0,0,0,0.9)] !text-sm overflow-auto',
          '!p-2 max-h-[45vh] !max-w-[80vw]'
        ),
        arrow: 'before:!bg-[rgba(0,0,0,0.9)]',
      }}
      TransitionComponent={Zoom}
      disableFocusListener
    >
      {isListItem ? (
        <li className={refClass}>
          {aContent}
          {referenceTags}
        </li>
      ) : (
        <div className={`${refClass} whitespace-normal`}>
          {aContent}
          {referenceTags}
        </div>
      )}
    </Tooltip>
  ) : (
    <li className={`${liProps.className} leading-7`}>{liProps.children}</li>
  )
}

export default LiParser
