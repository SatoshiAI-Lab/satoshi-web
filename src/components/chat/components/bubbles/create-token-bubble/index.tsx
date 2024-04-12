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
import { useCreateSolToken } from '@/hooks/use-create-sol-token'
import { DialogHeader } from '@/components/dialog-header'
import { WalletChain } from '@/config/wallet'
import { useCreateOpToken } from '@/hooks/use-create-op-token'
import { useCreateTokenConfig } from '@/hooks/use-create-token-config'

import type { UserCreateWalletResp } from '@/api/wallet/params'
import type { CreateTokenReq } from '@/api/interactive/types'

enum HotToken {
  WIF = 100_000_000,
  BOME = 68_999_649_476,
}

interface CreateTokenBubbleProps extends React.ComponentProps<'div'> {
  hasWallet: boolean
  chain?: string
}

const CreateTokenBubble = (props: CreateTokenBubbleProps) => {
  const { hasWallet, chain } = props
  const { t } = useTranslation()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [total, setTokenTotal] = useState(0)
  const [intro, setTokenIntro] = useState('')
  const [mintOpen, setMintOpen] = useState(false)
  // Use simplest method passed data, because just is parent-child component.
  const [selectedWallet, setSelectedWallet] = useState<UserCreateWalletResp>()
  const {
    hash,
    address,
    isLoading,
    isMinting,
    isCreateSuccess,
    isMintSuccess,
    isMintError,
    isLongTime,
    createToken: createSolToken,
    mintToken,
    cancel,
  } = useCreateSolToken()
  const { isOpLoading, isOpSuccess, createOpToken } = useCreateOpToken()
  const { config, configs } = useCreateTokenConfig(chain)

  const nicknameIsValid = !!name.trim()
  const nameIsValid = !!symbol.trim()
  const totalIsValid = total > 0
  const balance = Number(selectedWallet?.value || 0)

  const onCreate = () => {
    if (!chain || !config) return
    if (!selectedWallet?.id) {
      toast.error(t('no-wallet'))
      return
    }
    // TODO: uncomment
    // if (balance < config.minBalance) {
    //   toast.error(
    //     t('balance-less-than').replace('{}', String(config.minBalance))
    //   )
    //   return
    // }

    const params = {
      chain,
      id: selectedWallet.id,
      name: name.trim(),
      symbol: symbol.trim(),
      desc: intro.trim(),
      decimals: config.decimals,
      total,
    } as CreateTokenReq & {
      id: string
      total: number
    }

    if (chain === WalletChain.SOL) {
      createSolToken(params)
      return
    }

    if (chain === WalletChain.OP) {
      createOpToken(params)
      return
    }
  }

  useEffect(() => {
    if (isMintError) {
      setMintOpen(true)
    }
  }, [isMintError])

  // Unsupoorted chain.
  if (!config) {
    return (
      <MessageBubble className="pb-4 w-bubble">
        <div>{t('unsupported-chain')}</div>
        <ul>
          {Object.keys(configs).map((c) => (
            <li>- {c}</li>
          ))}
        </ul>
      </MessageBubble>
    )
  }

  // Loading state.
  if (isLoading || isOpLoading) {
    return (
      <CreateTokenLoading
        isMinting={isMinting}
        isLongTime={isLongTime}
        onCancel={cancel}
      />
    )
  }

  // Success state.
  if ((isCreateSuccess && isMintSuccess) || isOpSuccess) {
    return (
      <CreateTokenSuccess
        tokenName={name}
        tokenAddr={address}
        walletName={selectedWallet?.name}
      />
    )
  }

  // Create bubble.
  return (
    <MessageBubble className="pb-4 w-bubble">
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
      <CreateTokenWallets
        hasWallet={hasWallet}
        chain={chain}
        onSelectWallet={(wallet) => setSelectedWallet(wallet)}
      />
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
