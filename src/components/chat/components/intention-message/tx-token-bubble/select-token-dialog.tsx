import { DialogHeader } from '@/components/dialog-header'
import { useChainsPlatforms } from '@/components/wallet/hooks/use-chains-platforms'
import { useShow } from '@/hooks/use-show'
import { useWalletList } from '@/hooks/use-wallet-list'
import { useWalletStore } from '@/stores/use-wallet-store'
import { Dialog, MenuItem, OutlinedInput, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IoSearchOutline } from 'react-icons/io5'

interface Props {
  show: boolean
  open: () => void
  hidden: () => void
}

export const SelectTokenDialog = ({ hidden, show }: Props) => {
  const { t } = useTranslation()
  const { show: showSelect, open: openSelect, hidden: hiddenSelect } = useShow()

  const walletStore = useWalletStore.getState()

  return (
    <Dialog open={show} onClose={hidden}>
      <DialogHeader
        text={t('select-token')}
        onClose={hidden}
        textAlign="left"
      ></DialogHeader>
      <div className="min-h-[300px]">
        <div className="">
          <OutlinedInput
            type="text"
            className="mb-3 mx-6 bg-gray-100  !w-[400px] py-1"
            classes={{
              input: '!text-[15px]',
            }}
            size="small"
            placeholder={t('search.token.name')}
            startAdornment={
              <IoSearchOutline size={24} className="text-gray-400 mr-2" />
            }
          />
        </div>
        <div className="pt-4 px-6 border-t border-gray-400">
          <div className="">
            <span className="mr-2">{t('my.token')}</span>
            <Select
              value={walletStore?.currentWallet?.name! ?? ''}
              onClose={hiddenSelect}
              size="small"
            >
              {walletStore.allWalletList.map((wallet) => {
                return (
                  <MenuItem key={wallet.id} onClick={() => {}}>
                    {wallet.name}
                  </MenuItem>
                )
              })}
            </Select>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
