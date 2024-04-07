import { useTranslation } from 'react-i18next'
import MessageBubble from '../message-bubble'
import { ChatResponseAnswerMeta } from '@/api/chat/types'
import { useShow } from '@/hooks/use-show'
import { Dialog } from '@mui/material'
import { DialogHeader } from '@/components/dialog-header'
import { MonitorWallet } from '@/components/monitor/monitor-wallet'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const MonitorAddressBubble = ({ msg }: Props) => {
  const { t, i18n } = useTranslation()

  const { show, open, hidden } = useShow()

  return (
    <>
      <MessageBubble>
        <div className="">{t('monitor.wallet.bubble.text1')}</div>
        <div className="">{t('monitor.wallet.bubble.text2')}</div>
        {i18n.language == 'en' ? (
          <>
            <div className="">
              You can manage the wallets you are tracking through
              <span className="text-primary cursor-pointer" onClick={open}>
                Monitor-Track Wallet.
              </span>
            </div>
          </>
        ) : (
          <div>
            您可以通过
            <span className="text-primary cursor-pointer" onClick={open}>
              「监控-监控钱包」
            </span>
            管理您正在跟踪的钱包。
          </div>
        )}
      </MessageBubble>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader
          text={<>{t('monitor.wallet.title')}</>}
          onClose={hidden}
        ></DialogHeader>
        <MonitorWallet></MonitorWallet>
      </Dialog>
    </>
  )
}
