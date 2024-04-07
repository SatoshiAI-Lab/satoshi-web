import { useTranslation } from 'react-i18next'

import MultiMessage from './multi-message'
import SingleMessage from './single-message'
import { utilParse } from '@/utils/parse'

import type {
  ChatResponseAnswerMeta,
  ChatResponseMetaInteractive,
} from '@/api/chat/types'
import type { Message } from '@/stores/use-chat-store/types'
import type { MultiMessageProps } from './multi-message/types'

interface InteractiveMessageProps extends Omit<Message, 'msg' | 'type'> {
  msgs: ChatResponseAnswerMeta
  id?: string
}

function InteractiveMessage(props: InteractiveMessageProps) {
  const { msgs, id } = props
  const [t] = useTranslation()
  const msgKeys = Object.keys(msgs) as (keyof ChatResponseMetaInteractive)[]

  const isMultiple = (msgs: MultiMessageProps['msgs']) => {
    if (!msgs) return false

    const keys = msgs.reduce((p, m) => (p.add(m.key), p), new Set())

    return keys.size > 1
  }

  const renderMessages = (args: MultiMessageProps) => {
    if (args.msgs?.length === 0) return

    return isMultiple(args.msgs) ? (
      <MultiMessage {...args} key={args.key} />
    ) : (
      <SingleMessage {...args} key={args.key} />
    )
  }

  const formatTitle = (key: keyof ChatResponseMetaInteractive) => {
    const typeMap = utilParse.qs2Obj(t('multi-message-map'), {
      splitSymbol: '$',
    })
    const replaceMulti = t('multi-message').replace(/\${(.*?)}/, (_, text) => {
      const len = msgs[key]?.length ?? 0
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
      msgs: msgs[key],
      title: formatTitle(key),
    })
  )
}

export default InteractiveMessage
