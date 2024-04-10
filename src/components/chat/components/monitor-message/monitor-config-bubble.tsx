import {
  ChatResponseMetaNewsInfo,
  ChatResponseMetaAnnounceMent,
  ChatResponseMetaWallet,
  ChatResponseMetaTwitter,
  ChatResponseMetaNewPool,
} from '@/api/chat/types'
import { DataType, Message } from '@/stores/use-chat-store/types'
import ExchangeAnnouncementBubble from './exchange-announcement-bubble'
import NewPoolBubble from './new-pool-bubble'
import NewsBubble from './news-bubble'
import TwitterBubble from './twitter-bubble'
import WalletBubble from './wallet-bubble'

interface Props {
  msg: Message
}

export const MonitorConfigBubble = ({ msg }: Props) => {

  if (msg.data_type === DataType.NewsInfo) {
    return <NewsBubble data={msg as unknown as ChatResponseMetaNewsInfo} />
  }

  if (msg.data_type === DataType.AnnouncementInfo) {
    return (
      <ExchangeAnnouncementBubble
        data={msg as unknown as ChatResponseMetaAnnounceMent}
      />
    )
  }

  if (msg.data_type === DataType.TradeInfo) {
    return <WalletBubble data={msg.msg as unknown as ChatResponseMetaWallet} />
  }

  if (msg.data_type === DataType.TwitterInfo) {
    return <TwitterBubble data={msg as unknown as ChatResponseMetaTwitter} />
  }

  if (msg.data_type === DataType.PoolInfo) {
    return (
      <NewPoolBubble {...{ ...(msg as unknown as ChatResponseMetaNewPool) }} />
    )
  }
}
