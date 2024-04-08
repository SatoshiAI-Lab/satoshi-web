import React, { useState } from 'react'
import { Button, InputBase, TextField } from '@mui/material'
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

enum HotToken {
  WIF = 100_000_000,
  BOME = 68_999_649_476,
}

interface CreateTokenBubbleProps extends React.ComponentProps<'div'> {}

const CreateTokenBubble = (props: CreateTokenBubbleProps) => {
  const {} = props
  const { t } = useTranslation()
  const [tokenName, setTokenName] = useState('')
  const [tokenNickname, setTokenNickname] = useState('')
  const [tokenTotal, setTokenTotal] = useState(0)
  const [tokenIntro, setTokenIntro] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const nicknameIsValid = !!tokenNickname.trim()
  const nameIsValid = !!tokenName.trim()
  const totalIsValid = tokenTotal > 0

  const onCreate = () => {
    toast('Coming soon')
    console.log('create token')
  }

  if (isLoading) {
    return <CreateTokenLoading />
  }

  if (isSuccess) {
    return <CreateTokenSuccess />
  }

  return (
    <MessageBubble className="pb-4 w-[550px]">
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
      {/* Wallet list select */}
      <CreateTokenWallets />
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
