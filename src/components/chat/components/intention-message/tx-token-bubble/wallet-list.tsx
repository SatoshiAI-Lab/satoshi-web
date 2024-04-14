import { ChatResponseWalletListToken } from '@/api/chat/types'
import { WalletCardProps } from '@/stores/use-wallet-store'
import clsx from 'clsx'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'

interface Props {
  isFinalTx: boolean
  gridWalletList: WalletCardProps[][]
  walletList: WalletCardProps[]
  selectWallet?: WalletCardProps
  onSelectWallet: (wallet: WalletCardProps) => void
  getSelectTokenInfo: (
    wallet: WalletCardProps
  ) => ChatResponseWalletListToken | undefined
}

export const WalletList = ({
  isFinalTx,
  gridWalletList,
  walletList,
  selectWallet,
  onSelectWallet,
  getSelectTokenInfo,
}: Props) => {
  const { t } = useTranslation()

  const getCols = (count: number) => {
    if (count == 1) {
      return 'grid-cols-[120px]'
    }
    if (count == 2) {
      return 'grid-cols-[120px_120px]'
    }

    return 'grid-cols-[120px_120px_120px]'
  }

  return (
    <div className={clsx(isFinalTx && 'pointer-events-none')}>
      <div className="font-bold mt-5 mb-1 ">
        {walletList.length == 1
          ? t('tx.token.wallet.balance')
          : t('tx.token.text2')}
      </div>

      <div className={clsx('inline-block border rounded-2xl')}>
        {gridWalletList.map((wallets, i) => {
          return (
            <div
              key={i}
              className={clsx(
                'grid',
                i !== 0 ? 'border-t' : '',
                getCols(wallets.length)
              )}
            >
              {wallets.map((wallet, i) => {
                const toeknInfo = getSelectTokenInfo(wallet)
                return (
                  <div
                    key={i}
                    className={clsx(
                      'p-3 transition-all hover:text-gray-500 cursor-pointer',
                      selectWallet?.id == wallet.id ? '!text-primary' : '',
                      i === 1 ? 'border-x' : '',
                      i === wallets.length - 1 ? '!border-r-0' : ''
                    )}
                    onClick={() => {
                      onSelectWallet(wallet)
                    }}
                  >
                    <div className="truncate">{wallet.name}</div>
                    <div className="text-sm text-gray-500">
                      {Number(
                        numeral(
                          formatUnits(
                            BigInt(toeknInfo?.amount ?? 0),
                            toeknInfo?.decimals ?? 0
                          )
                        ).format('0.0000')
                      )}
                      {toeknInfo?.symbol}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
