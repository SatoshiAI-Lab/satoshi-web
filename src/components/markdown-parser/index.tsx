import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'

import AParser from './components/a-parser'
import PParser from './components/p-parser'
import BrParser from './components/br-parser'
import UlParser from './components/ul-parser'
import OlParser from './components/ol-parser'
import DivParser from './components/div-parser'
import CodeParser from './components/code-parser'
import SpanParser from './components/span-parser'
import LiParser from './components/li-parser'

interface MarkdownParserProps {
  children: string
  clearCodeBreak?: boolean
  isRef?: boolean
  className?: string
}

export const MarkdownParser: React.FC<MarkdownParserProps> = (props) => {
  const { children } = props

  // Handling links here would be better
  const formatLink = (str: string) => {
    const rule = /http[\x00-\x7F]+/g
    // Be careful, not to add `href` here.
    return str.replaceAll(rule, ($1) => `<a>${$1}</a>`)
  }

  return (
    <ReactMarkdown
      children={formatLink(children)}
      // `remarkMath` may cause market rendering to be repeated
      remarkPlugins={[remarkGfm]} // GFM: GitHub Flavored Markdown
      // @ts-ignore
      rehypePlugins={[rehypeKatex, rehypeRaw]} // When encountering custom tags like <reference>, probbly parsing failed.
      components={{
        code: (props) => <CodeParser codeProps={props} />,
        span: (props) => <SpanParser spanProps={props} />,
        div: (props) => <DivParser divProps={props} />,
        ol: (props) => <OlParser olProps={props} />,
        ul: (props) => <UlParser ulProps={props} />,
        li: (props) => <LiParser liProps={props} />,
        br: (props) => <BrParser brProps={props} />,
        a: (props) => <AParser aProps={props} />,
        p: (props) => <PParser pProps={props} />,
      }}
    />
  )
}

export default MarkdownParser
