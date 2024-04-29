import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { BsFillLightningFill } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { isEmpty } from 'lodash'

import type { UserCreateWalletResp } from '@/api/wallet/params'
import type { CreateTokenInfo } from './types'

import { MessageBubble } from '../../../message-bubble'
import { TokenCreateWallets } from './components/wallets'
import { TokenCreateLoading } from './components/loading'
import { TokenCreateSuccess } from './components/success'
import { useCreateSolToken } from '@/components/chat/components/intention-message/token-messages/token-create/hooks/use-create-sol-token'
import { DialogHeader } from '@/components/dialog-header'
import { Chain } from '@/config/wallet'
import { useCreateEvmToken } from '@/components/chat/components/intention-message/token-messages/token-create/hooks/use-create-evm-token'
import { useTokenCreateConfig } from '@/hooks/use-token-create-config'
import { TokenCreateForm } from './components/form'
import { TokenCreateHints } from './components/hints'
import { useMessagesContext } from '@/contexts/messages'
import { MetaType } from '@/api/chat/types'
import { ChainSelectMessage } from '../../../chain-select-message'

export const TokenCreateMessage = () => {
  const { getMetaData } = useMessagesContext()
  const { chain_name } = getMetaData<MetaType.TokenCreate>()
  const { t } = useTranslation()
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [total, setTokenTotal] = useState(0)
  const [intro, setTokenIntro] = useState('')
  const [mintOpen, setMintOpen] = useState(false)
  // Use simplest method passed data, because just is parent-child component.
  const [selectedWallet, setSelectedWallet] = useState<UserCreateWalletResp>()
  const [selectedChain, setSelectedChain] = useState(chain_name)
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
  const { evmAddr, isEvmLoading, isEvmLongTime, isEvmSuccess, createEvmToken } =
    useCreateEvmToken(selectedChain)
  const { config, supports, unsupports, isUnsupport } =
    useTokenCreateConfig(selectedChain)
  const [createTipOpen, setCreateTipOpen] = useState(false)

  // Form validate field.
  const symbolIsValid = !!name.trim()
  const nameIsValid = !!symbol.trim()
  const totalIsValid = total > 0
  const balance = Number(selectedWallet?.value || 0)

  const isLoading = isSolLoading || isEvmLoading
  const isSuccess = (isSolCreateSuccess && isSolMintSuccess) || isEvmSuccess

  const onCreate = () => {
    if (isEmpty(selectedChain) || !config) return
    if (!selectedWallet?.id) {
      toast.error(t('no-wallet'))
      return
    }
    if (balance < config.minBalance) {
      toast.error(
        t('balance-less-than').replace(
          '{}',
          `${config.minBalance} ${config.nativeToken}`
        )
      )
      return
    }

    const params: CreateTokenInfo = {
      chain: selectedChain,
      id: selectedWallet.id,
      name: name.trim(),
      symbol: symbol.trim(),
      desc: intro.trim(),
      decimals: config.decimals,
      total,
    }

    console.log('create token', params)

    if (selectedChain === Chain.Sol) {
      createSolToken(params)
      return
    }

    // If everything goes as expected, this will be EVM.
    createEvmToken(params)
  }

  // If mint error, show tips.
  useEffect(() => {
    if (isSolMintError) {
      setMintOpen(true)
    }
  }, [isSolMintError])

  // Chain is empty.
  if (isEmpty(selectedChain)) {
    return (
      <ChainSelectMessage
        title={t('token-create.chain-empty')}
        unsupports={unsupports.map((c) => c.name)}
        onClick={(c) => setSelectedChain(c.name)}
      />
    )
  }

  // Unsupoorted chain.
  if (isUnsupport()) {
    return (
      <MessageBubble className="pb-4 w-bubble">
        <div>{t('unsupported-chain')}</div>
        <ul>
          {Object.keys(supports).map((c) => (
            <li key={c}>- {c}</li>
          ))}
        </ul>
      </MessageBubble>
    )
  }

  // Loading state.
  if (isLoading) {
    return (
      <TokenCreateLoading
        isMinting={isSolMinting}
        isLongTime={isSolLongTime || isEvmLongTime}
        onCancel={cancelSol}
      />
    )
  }

  // Success state.
  if (isSuccess) {
    return (
      <TokenCreateSuccess
        tokenName={name}
        tokenAddr={solAddr || evmAddr}
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
                  `<span class="font-bold">${config?.minBalance} ${config?.nativeToken}</span>`
                ),
            }}
          ></div>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: t('create-token.confirm2').replace(
                '{}',
                `<span class="font-bold">${selectedChain}</span>`
              ),
            }}
          ></div>
        </DialogContent>
        <DialogActions classes={{ root: '!pb-4 !pr-6' }}>
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
      <TokenCreateForm
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
      <TokenCreateWallets
        chain={selectedChain}
        onSelectWallet={(wallet) => setSelectedWallet(wallet)}
      />

      {/* Invalid hints. */}
      <TokenCreateHints
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

export default TokenCreateMessage
