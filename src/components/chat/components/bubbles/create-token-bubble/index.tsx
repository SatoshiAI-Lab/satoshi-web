import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputBase,
  TextField,
} from '@mui/material'
import { BsFillLightningFill } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import numeral from 'numeral'
import toast from 'react-hot-toast'

import MessageBubble from '../message-bubble'
import ImageUploader from '@/components/image-uploader'
import CreateTokenWallets from './wallets'
import CreateTokenLoading from './loading'
import CreateTokenSuccess from './success'
import { useCreateToken } from '@/hooks/use-create-token'
import { useWalletStore } from '@/stores/use-wallet-store'
import { DialogHeader } from '@/components/dialog-header'

enum HotToken {
  WIF = 100_000_000,
  BOME = 68_999_649_476,
}

interface CreateTokenBubbleProps extends React.ComponentProps<'div'> {
  hasWallet: boolean
}

const CreateTokenBubble = (props: CreateTokenBubbleProps) => {
  const { hasWallet } = props
  const { t } = useTranslation()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [total, setTokenTotal] = useState(0)
  const [intro, setTokenIntro] = useState('')
  const {
    hash,
    address,
    isLoading,
    isMinting,
    isCreateSuccess,
    isMintSuccess,
    isMintError,
    isLongTime,
    createToken,
    mintToken,
    cancel,
  } = useCreateToken()
  const { currentWallet } = useWalletStore()

  const nicknameIsValid = !!name.trim()
  const nameIsValid = !!symbol.trim()
  const totalIsValid = total > 0

  const onCreate = () => {
    if (!currentWallet?.id) {
      toast.error(t('no-wallet'))
      return
    }
    const minBalance = 0.16
    if (Number(currentWallet?.value || 0) < minBalance) {
      toast.error(t('balance-less-than').replace('{}', String(minBalance)))
      return
    }

    createToken({
      id: currentWallet.id,
      name: name.trim(),
      symbol: symbol.trim(),
      desc: intro.trim(),
      decimals: 9, // TODO: the decimals should be dynamic.
      total,
    })
  }

  const [mintOpen, setMintOpen] = useState(false)

  useEffect(() => {
    if (isMintError) {
      setMintOpen(true)
    }
  }, [isMintError])

  if (isLoading) {
    return (
      <CreateTokenLoading
        isMinting={isMinting}
        isLongTime={isLongTime}
        onCancel={cancel}
      />
    )
  }

  if (isCreateSuccess && isMintSuccess) {
    return (
      <CreateTokenSuccess
        tokenName={name}
        tokenAddr={address}
        walletName={currentWallet?.name}
      />
    )
  }

  return (
    <MessageBubble className="pb-4 w-[580px]">
      <Dialog open={mintOpen}>
        <DialogHeader onClose={() => setMintOpen(false)}>
          <div className="mr-10">Your token has been created.</div>
        </DialogHeader>
        <DialogContent>
          <div className="text-lg">
            <span className="font-bold">{t('addr')}</span>:{address}
          </div>
          <div className="text-lg">
            <span className="font-bold">{t('hash')}</span>:{hash}
          </div>
          <div className="text-lg mt-4">{t('mint-error')}</div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setMintOpen(false)
              mintToken()
            }}
          >
            {t('continue')}
          </Button>
          <Button variant="outlined" onClick={() => setMintOpen(false)}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <div className="font-bold">
        {t('create-token.title').split('$')[0]}
        <br />
        {t('create-token.title').split('$')[1]}
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="mb-1">{t('token-symbol')}*</div>
            <TextField
              size="small"
              autoComplete="off"
              value={symbol}
              onChange={({ target }) => setSymbol(target.value)}
            />
          </div>
          <div className="flex flex-col">
            <div className="mb-1">{t('token-fullname')}*</div>
            <TextField
              size="small"
              autoComplete="off"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col mr-4">
          <div className="mb-1">{t('token-logo')}</div>
          <ImageUploader />
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
          value={numeral(total).format(',')}
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
          value={intro}
          onChange={({ target }) => setTokenIntro(target.value)}
        />
      </div>
      {/* Wallet list select */}
      <CreateTokenWallets hasWallet={hasWallet} />
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
