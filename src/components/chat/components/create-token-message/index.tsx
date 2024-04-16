import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { BsFillLightningFill } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import MessageBubble from '../message-bubble'
import CreateTokenWallets from './wallets'
import CreateTokenLoading from './loading'
import CreateTokenSuccess from './success'
import { useCreateSolToken } from '@/hooks/use-create-sol-token'
import { DialogHeader } from '@/components/dialog-header'
import { WalletChain } from '@/config/wallet'
import { useCreateOpToken } from '@/hooks/use-create-op-token'
import { useCreateTokenConfig } from '@/hooks/use-create-token-config'
import { CreateTokenForm } from './form'
import { CreateTokenHints } from './hints'

import type { UserCreateWalletResp } from '@/api/wallet/params'
import type { CreateTokenInfo } from './types'

interface CreateTokenBubbleProps extends React.ComponentProps<'div'> {
  hasWallet: boolean
  chain?: string
}

const CreateTokenMessage = (props: CreateTokenBubbleProps) => {
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
    solHash,
    solAddr,
    isSolLoading,
    isSolMinting,
    isSolCreateSuccess,
    isSolMintSuccess,
    isSolMintError,
    isSolLongTime,
    createSolToken,
    mintSolToken,
    cancelSol,
  } = useCreateSolToken()
  const { opAddr, isOpLoading, isOpLongTime, isOpSuccess, createOpToken } =
    useCreateOpToken(chain)
  const { config, configs } = useCreateTokenConfig(chain)
  const [createTipOpen, setCreateTipOpen] = useState(false)

  // Form validate field.
  const symbolIsValid = !!name.trim()
  const nameIsValid = !!symbol.trim()
  const totalIsValid = total > 0
  const balance = Number(selectedWallet?.value || 0)

  // Show unsupported component.
  const showUnsupported = !config
  // Show loading component.
  const showLoading = isSolLoading || isOpLoading
  // Show success component.
  const showSuccess = (isSolCreateSuccess && isSolMintSuccess) || isOpSuccess

  const onCreate = () => {
    if (!chain || !config) return
    if (!selectedWallet?.id) {
      toast.error(t('no-wallet'))
      return
    }
    if (balance < config.minBalance) {
      toast.error(
        t('balance-less-than').replace('{}', String(config.minBalance))
      )
      return
    }

    const params: CreateTokenInfo = {
      chain,
      id: selectedWallet.id,
      name: name.trim(),
      symbol: symbol.trim(),
      desc: intro.trim(),
      decimals: config.decimals,
      total,
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

  // If mint error, show tips.
  useEffect(() => {
    if (isSolMintError) {
      setMintOpen(true)
    }
  }, [isSolMintError])

  // Unsupoorted chain.
  if (showUnsupported) {
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
  if (showLoading) {
    return (
      <CreateTokenLoading
        isMinting={isSolMinting}
        isLongTime={isSolLongTime || isOpLongTime}
        onCancel={cancelSol}
      />
    )
  }

  // Success state.
  if (showSuccess) {
    return (
      <CreateTokenSuccess
        tokenName={name}
        tokenAddr={solAddr || opAddr}
        walletName={selectedWallet?.name}
      />
    )
  }

  // Create bubble.
  return (
    <MessageBubble className="pb-4 w-bubble">
      {/* Create tips dialog. */}
      <Dialog open={createTipOpen}>
        <DialogHeader
          text={t('create-token.confirm')}
          onClose={() => setCreateTipOpen(false)}
        />
        <DialogContent>
          <div
            dangerouslySetInnerHTML={{
              __html: t('create-token.confirm1')
                .replace(
                  '{}',
                  `<span class="font-bold">${selectedWallet?.name ?? ''}</span>`
                )
                .replace(
                  '{}',
                  `<span class="font-bold">${config.minBalance} ${config.nativeToken}</span>`
                ),
            }}
          ></div>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: t('create-token.confirm2').replace(
                '{}',
                `<span class="font-bold">${chain}</span>`
              ),
            }}
          ></div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onCreate}>
            {t('confirm-pure')}
          </Button>
          <Button variant="outlined" onClick={() => setCreateTipOpen(false)}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mint error tips dialog. */}
      <Dialog open={mintOpen}>
        <DialogHeader onClose={() => setMintOpen(false)}>
          <div className="mr-10">{t('create-token.created')}</div>
        </DialogHeader>
        <DialogContent>
          <div className="text-lg">
            <span className="font-bold">{t('addr')}</span>:{solAddr}
          </div>
          <div className="text-lg">
            <span className="font-bold">{t('hash')}</span>:{solHash}
          </div>
          <div className="text-lg mt-4">{t('mint-error')}</div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setMintOpen(false)
              mintSolToken()
            }}
          >
            {t('continue')}
          </Button>
          <Button variant="outlined" onClick={() => setMintOpen(false)}>
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Title. */}
      <div className="font-bold">
        {t('create-token.title').split('$')[0]}
        <br />
        {t('create-token.title').split('$')[1]}
      </div>

      {/* Create Form */}
      <CreateTokenForm
        symbol={symbol}
        name={name}
        total={total}
        intro={intro}
        onSymbolChange={setSymbol}
        onNameChange={setName}
        onTotalChange={setTokenTotal}
        onIntroChange={setTokenIntro}
      />

      {/* Wallet list select. */}
      <CreateTokenWallets
        hasWallet={hasWallet}
        chain={chain}
        onSelectWallet={(wallet) => setSelectedWallet(wallet)}
      />

      {/* Invalid hints. */}
      <CreateTokenHints
        symbolIsValid={symbolIsValid}
        nameIsValid={nameIsValid}
        totalIsValid={totalIsValid}
      />

      {/* Create button. */}
      <Button
        variant="contained"
        classes={{ root: '!rounded-full !px-8 !text-base' }}
        disabled={!symbolIsValid || !nameIsValid || !totalIsValid}
        onClick={() => setCreateTipOpen(true)}
        startIcon={<BsFillLightningFill size={18} />}
      >
        {t('create')}
      </Button>
    </MessageBubble>
  )
}

export default CreateTokenMessage
