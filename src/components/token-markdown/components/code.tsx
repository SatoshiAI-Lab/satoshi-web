import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineCopy } from 'react-icons/ai'
// @ts-ignore
import { Prism } from 'react-syntax-highlighter'
import clsx from 'clsx'

import { useClipboard } from '@/hooks/use-clipboard'

import type { CodeProps } from 'react-markdown/lib/ast-to-react'

interface Props extends CodeProps {
  clearCodeBreak?: boolean
}

export const Code = (props: Props) => {
  const { className, children, inline, clearCodeBreak = true } = props
  const lang = className?.match(/language-(\w+)/)?.[1] ?? ''
  const parserChildren = clearCodeBreak
    ? String(children).replace(/\n+$/, '')
    : children
  const { t } = useTranslation()
  const { copy } = useClipboard()

  const onCopy = (children: React.ReactNode[]) => {
    const str = children.reduce((a, b) => `${a}\n${b}`, '') as string
    copy(str)
  }

  // Inline block
  if (inline) {
    return <span className={clsx('mx-1 px-1.5 rounded')}>{parserChildren}</span>
  }

  return (
    <div className="pt-1 relative group">
      <p className={clsx('absolute left-2 top-[1.2rem]')}>{lang}</p>
      <p
        className={clsx(
          'absolute right-3 top-[1.2rem] transition-all items-center',
          'cursor-pointer hidden group-hover:flex gap-1 text-sm',
          'hover:drop-shadow-bold dark:hover:drop-shadow-bold-dark'
        )}
        onClick={() => onCopy(children)}
      >
        <AiOutlineCopy />
        <span>{t('copy')}</span>
      </p>
      <Prism
        className="!pt-8 !px-1 !pb-1"
        language={lang}
        children={parserChildren}
        showLineNumbers
      />
    </div>
  )
}

export default Code
