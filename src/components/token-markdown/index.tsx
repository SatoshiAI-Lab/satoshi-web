import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// import remarkMath from 'remark-math'
// import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'

import A from './components/a'
import P from './components/p'
import Br from './components/br'
import Ul from './components/ul'
import Ol from './components/ol'
import Div from './components/div'
import Code from './components/code'
import Span from './components/span'
import Li from './components/li'

interface MarkdownParserProps {
  children: string
  clearCodeBreak?: boolean
  isRef?: boolean
  className?: string
}

// Only used for token's markdown.
export const TokenMarkdown: React.FC<MarkdownParserProps> = (props) => {
  const { children } = props

  // Handling links here would be better
  const formatLink = (str: string) => {
    const rule = /http[\x00-\x7F]+/g
    // Be careful, not to add `href` here.
    return str.replaceAll(rule, ($1) => `<a>${$1}</a>`)
  }

  return (
    <ReactMarkdown
      children={children}
      // `remarkMath` may cause market rendering to be repeated
      remarkPlugins={[remarkGfm]} // GFM: GitHub Flavored Markdown
      // @ts-ignore
      rehypePlugins={[rehypeRaw]} // When encountering custom tags like <reference>, probbly parsing failed.
      components={{
        code: (props) => <Code {...props} />,
        span: (props) => <Span {...props} />,
        div: (props) => <Div {...props} />,
        ol: (props) => <Ol {...props} />,
        ul: (props) => <Ul {...props} />,
        li: (props) => <Li {...props} />,
        br: (props) => <Br {...props} />,
        a: (props) => <A {...props} />,
        p: (props) => <P {...props} />,
      }}
    />
  )
}

export default TokenMarkdown
