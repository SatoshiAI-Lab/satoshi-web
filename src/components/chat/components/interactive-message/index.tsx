import { useTranslation } from 'react-i18next'

import type { ChatMetaInteractive } from '@/api/chat/types'
import type { MultiMessageProps } from './multi-message/types'

import { MultiMessage } from './multi-message'
import { SingleMessage } from './single-message'
import { utilParse } from '@/utils/parse'
import { useMessagesContext } from '@/contexts/messages'

export const InteractiveMessage = () => {
  const {
    message: { meta, id },
  } = useMessagesContext()
  const [t] = useTranslation()
  const msgKeys = Object.keys(meta!) as (keyof ChatMetaInteractive)[]

  const isMultiple = (msgs: MultiMessageProps['meta']) => {
    if (!msgs) return false

    const keys = msgs.reduce((p, m) => (p.add(m.key), p), new Set())

    return keys.size > 1
  }

  const renderMessages = (args: MultiMessageProps) => {
    if (args.meta?.length === 0) return

    return isMultiple(args.meta) ? (
      <MultiMessage {...args} key={args.key} />
    ) : (
      <SingleMessage {...args} key={args.key} />
    )
  }

  const formatTitle = (key: keyof ChatMetaInteractive) => {
    const typeMap = utilParse.qsToObj(t('multi-message-map'), {
      splitSymbol: '$',
    })
    const replaceMulti = t('multi-message').replace(/\${(.*?)}/, (_, text) => {
      const len = meta?.[key]?.length ?? 0
      // if less than 1, exclude `Multiple` string
      return len > 1 ? text : ''
    })
    const replaceType = replaceMulti.replace('${}', typeMap[key])

    return replaceType
  }

  return msgKeys.map((key, index) =>
    renderMessages({
      id,
      key: index,
      meta: meta?.[key],
      title: formatTitle(key),
    })
  )
}

export default InteractiveMessage
