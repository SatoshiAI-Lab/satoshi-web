import type {
  ChatResponseAnswerMetaCoin,
  ChatResponseMeta,
} from '@/api/chat/types'

export interface MultiMessageProps {
  id?: string
  meta?: IMultiMessage[]
  classes?: string
  title?: string
  key?: string | number
  onCompleted?: (checked: IMultiMessage[]) => void
}

export interface IMultiMessage extends ChatResponseAnswerMetaCoin {
  checked?: boolean
  disabled?: boolean
}
