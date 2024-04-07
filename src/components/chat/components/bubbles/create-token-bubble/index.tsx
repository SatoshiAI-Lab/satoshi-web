import React, { useEffect, useState } from 'react'
import {
  Button,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { AiOutlineCopy } from 'react-icons/ai'
import { BsFillLightningFill } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import numeral from 'numeral'

import MessageBubble from '../message-bubble'
import FileUploader from '@/components/file-uploader'
import { utilArr } from '@/utils/array'
import { useClipboard } from '@/hooks/use-clipboard'
import { useWalletStore } from '@/stores/use-wallet-store'
import { utilFmt } from '@/utils/format'
import { Wallet } from '@/components/wallet'

enum HotToken {
  WIF = 100_000_000,
  BOME = 68_999_649_476,
}

interface CreateTokenBubbleProps extends React.ComponentProps<'div'> {}

const CreateTokenBubble = (props: CreateTokenBubbleProps) => {
  const {} = props
  const { currentWallet, wallets, getWallets, setCurrentWallet } =
    useWalletStore()
  const [tokenName, setTokenName] = useState('')
  const [tokenNickname, setTokenNickname] = useState('')
  const [tokenTotal, setTokenTotal] = useState(0)
  const [tokenIntro, setTokenIntro] = useState('')
  const { copy } = useClipboard()
  const { t } = useTranslation()
  const [walletOpen, setWalletOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<
    typeof currentWallet | undefined
  >(undefined)

  const nicknameIsValid = !!tokenNickname.trim()
  const nameIsValid = !!tokenName.trim()
  const totalIsValid = tokenTotal > 0

  const onViewDetails = () => {
    console.log('view wallet details')
    setWalletOpen(true)
  }

  const onCreate = () => {
    console.log('create token')
  }

  const onSelect = ({ target }: SelectChangeEvent<string>) => {
    const targetWallet = wallets.find(
      (w) => utilFmt.addr(w.address) === target.value
    )

    setCurrentWallet(targetWallet?.address ?? '')
  }

  useEffect(() => {
    if (utilArr.isEmpty(wallets)) return

    setCurrentWallet(utilArr.first(wallets).address ?? '')
  }, [wallets])

  useEffect(() => {
    if (currentWallet.address) {
      setSelectedWallet(currentWallet)
    }
  }, [currentWallet])

  useEffect(() => {
    getWallets()
  }, [])

  return (
    <MessageBubble className="pb-4 w-[550px]">
      <Wallet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        showButtons={false}
        onlyWalletAddr={currentWallet.address}
      />
      <div className="font-bold">{t('create-token.title')}</div>
      <div className="flex justify-between mt-4">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="mb-1">{t('token-nickname')}*</div>
            <TextField
              size="small"
              autoComplete="off"
              value={tokenNickname}
              onChange={({ target }) => setTokenNickname(target.value)}
            />
          </div>
          <div className="flex flex-col">
            <div className="mb-1">{t('token-fullname')}*</div>
            <TextField
              size="small"
              autoComplete="off"
              value={tokenName}
              onChange={({ target }) => setTokenName(target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col mr-4">
          <div className="mb-1">{t('token-logo')}</div>
          <FileUploader />
        </div>
      </div>
      <div className="mt-4 w-[360px]">
        <div className="mb-1 flex justify-between items-center">
          <div>{t('token-total-supply')}*</div>
          <div className="flex items-center">
            <div
              className="text-primary text-sm mr-3 cursor-pointer"
              onClick={() => setTokenTotal(HotToken.WIF)}
            >
              {t('same-wif')}
            </div>
            <div
              className="text-primary text-sm cursor-pointer"
              onClick={() => setTokenTotal(HotToken.BOME)}
            >
              {t('same-bome')}
            </div>
          </div>
        </div>
        <TextField
          size="small"
          autoComplete="off"
          classes={{ root: 'w-full' }}
          value={numeral(tokenTotal).format(',')}
          onChange={({ target }) => {
            const num = numeral(target.value).value()

            if (!num || Number.isNaN(num) || num < 0) return
            setTokenTotal(num)
          }}
        />
      </div>
      <div className="mt-4 w-[360px]">
        <div className="mb-1">{t('token-intro')}</div>
        <InputBase
          classes={{
            root: clsx(
              'w-full !border !border-gray-400 !rounded !px-2 !py-2 !text-base',
              'hover:!border-black focus-within:outline focus-within:outline-1',
              'focus-within:outline-primary focus-within:!border-primary',
              'focus-within:hover:!border-primary'
            ),
          }}
          multiline
          size="small"
          rows={3}
          autoComplete="off"
          placeholder={t('token-intro.placeholder')}
          value={tokenIntro}
          onChange={({ target }) => setTokenIntro(target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1">{t('use-below-wallet')}</div>
        <div className="flex items-stretch">
          <Select
            size="small"
            value={utilFmt.addr(selectedWallet?.address)}
            onChange={onSelect}
          >
            {wallets.map((w) => (
              <MenuItem key={w.id} value={utilFmt.addr(w?.address)}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
          <div className="flex flex-col justify-between text-sm ml-2">
            <span
              className="text-primary cursor-pointer"
              onClick={onViewDetails}
            >
              {t('view-wallet-details')}
            </span>
            <span className="text-gray-500">
              {t('wallet-balance-confirm').replace('{}', '0.1 SOL')}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div>
          {currentWallet.name} {t('addr')}:
        </div>
        <div className="flex items-center">
          <span>{currentWallet.address}</span>
          <AiOutlineCopy
            className="ml-2 cursor-pointer"
            size={18}
            onClick={() => copy(currentWallet.address ?? '')}
          />
        </div>
      </div>
      <div className="my-4">
        {!nicknameIsValid && (
          <div className="text-rise text-sm">
            <span className="text-thirdly">●</span>{' '}
            {t('token-nickname-validate')}
          </div>
        )}
        {!nameIsValid && (
          <div className="text-rise text-sm my-1">
            <span className="text-thirdly">●</span>{' '}
            {t('token-fullname-validate')}
          </div>
        )}
        {!totalIsValid && (
          <div className="text-rise text-sm">
            <span className="text-thirdly">●</span> {t('token-total-validate')}
          </div>
        )}
      </div>
      <Button
        variant="contained"
        classes={{ root: '!rounded-full !px-8 !text-base' }}
        disabled={!nicknameIsValid || !nameIsValid || !totalIsValid}
        onClick={onCreate}
        startIcon={<BsFillLightningFill size={18} />}
      >
        {t('create')}
      </Button>
    </MessageBubble>
  )
}

export default CreateTokenBubble
