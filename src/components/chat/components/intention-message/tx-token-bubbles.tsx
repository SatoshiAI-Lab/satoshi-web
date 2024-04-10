import { useTranslation } from 'react-i18next'
import MessageBubble from '../message-bubble'
import { Button, CircularProgress, OutlinedInput } from '@mui/material'
import { IoCopyOutline, IoFlash } from 'react-icons/io5'
import clsx from 'clsx'
import { useState } from 'react'
import {
  ChatResponseAnswerMeta,
  ChatResponseTxConfrim,
  ChatResponseWalletListToken,
} from '@/api/chat/types'
import { trandApi } from '@/api/trand'
import { useShow } from '@/hooks/use-show'
import { formatUnits } from 'viem'
import numeral from 'numeral'
import { useWalletStore } from '@/stores/use-wallet-store'
import { WalletCardProps } from '@/stores/use-wallet-store/types'
import { CHAT_CONFIG } from '@/config/chat'
import { BigNumber } from 'bignumber.js'
import { useChat } from '@/hooks/use-chat'
import { FaArrowRightLong } from 'react-icons/fa6'
import { utilFmt } from '@/utils/format'
import { link } from '@/config/link'

interface Props {
  msg: ChatResponseAnswerMeta
}

const rate = [20, 50, 100]
export const TxTokenBubbles = (props: Props) => {
  const data = props.msg.data as unknown as ChatResponseTxConfrim
  const isBuy = props.msg.type == CHAT_CONFIG.metadataType.transactionConfirmBuy

  const [disbaled, setDisabled] = useState(false)
  const [curRate, setCurRate] = useState(-1)
  const [buyValue, setBuyValue] = useState(data.amount)
  const [slippage, setSlippage] = useState(5)
  const [validateErr, setValidateErr] = useState<string[]>([])

  const { t } = useTranslation()
  const { addMessage } = useChat()

  const { wallets, currentWallet, setCurrentWallet } = useWalletStore()
  const { show: loading, open: showLoading, hidden: closeLoading } = useShow()

  const isToken = (token: ChatResponseWalletListToken) => {
    return token.amount > 0 && data.address_filter.includes(token.address)
  }

  const rawWalletList = [...wallets]
    .filter((wallet) => {
      const x = wallet.platform == data.chain_filter.platform
      const y = wallet.chain?.name == data.chain_filter.chain_name
      const z = wallet.tokens?.some(isToken)

      return x && y && z
    })
    ?.sort((a, b) => {
      const x = new Date(b.added_at!).getTime()
      const y = new Date(a.added_at!).getTime()
      return x - y
    })

  if (!rawWalletList.length) {
    return (
      <MessageBubble>
        {t('insufficient.balance.terms').replace('$1', data.from_token_name)}
      </MessageBubble>
    )
  }

  if (!currentWallet) {
    setCurrentWallet(rawWalletList[0].address)
  }

  let count = 0

  const walletList = rawWalletList.reduce<WalletCardProps[][]>((cur, next) => {
    if (count % 3 == 0) {
      cur.push([])
    }
    cur[cur.length - 1].push(next)
    count++
    return cur
  }, [])

  const checkForm = () => {
    let error: string[] = []

    if (buyValue <= 0) {
      error.push(t('tx.form.error1'))
    }

    const wallet = rawWalletList.find(
      (wallet) => wallet.id == currentWallet?.id
    )!

    if (buyValue > getTargetToken(wallet)!.amount) {
      error.push(t('tx.form.error2'))
    }

    if (slippage <= 0.05) {
      error.push(t('tx.form.error3'))
    }

    setValidateErr(error)

    return error.length === 0
  }

  const onConfirm = () => {
    if (checkForm()) {
      showLoading()
      trandApi
        .buyToken(currentWallet!.id!, {
          amount: `${buyValue}`,
          input_token: data.from_token_contract,
          output_token: data.to_token_contract,
          platform: 'SOL',
          slippageBps: slippage,
        })
        .then(({ data }) => {
          setDisabled(true)
          addMessage({
            msg: `${t('successful.transaction')}${link.solscan}tx/${
              data.hash_tx
            }`,
          })
        })
        .finally(() => {
          closeLoading()
        })
    }
  }

  const getTargetToken = (wallet: WalletCardProps) => {
    return wallet?.tokens?.find(isToken)
  }

  const fromToken = getTargetToken(currentWallet ?? rawWalletList[0])

  const handleRateClick = (rate: number) => {
    if (rate != curRate) {
      setCurRate(rate)

      setBuyValue(
        Number(
          BigNumber(
            formatUnits(BigInt(fromToken?.amount!), fromToken?.decimals!)
          )
            .multipliedBy(rate / 100)
            .toFixed(5)
        )
      )
    } else {
      setBuyValue(0)
      setCurRate(-1)
    }
  }

  const getCols = (count: number) => {
    if (count == 1) {
      return 'grid-cols-[120px]'
    }
    if (count == 2) {
      return 'grid-cols-[120px_120px]'
    }

    return 'grid-cols-[120px_120px_120px]'
  }

  const getWalllet = () => {
    // if (rawWalletList.length == 1) {
    //   return (
    //     <>
    //       <div className="font-bold mt-5 mb-1 ">
    //         {rawWalletList[0].name}
    //         {t('tx.token.wallet.balance')}
    //       </div>
    //       <div>
    //         {rawWalletList[0].value}
    //         {rawWalletList[0].platform}
    //       </div>
    //     </>
    //   )
    // } else {
    return (
      <>
        <div className="font-bold mt-5 mb-1 ">
          {rawWalletList.length == 1
            ? t('tx.token.wallet.balance')
            : t('tx.token.text2')}
        </div>

        <div
          className={clsx(
            'inline-block border rounded-2xl',
            disbaled && 'pointer-events-none'
          )}
        >
          {walletList.map((wallets, i) => {
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
                  const platformToken = getTargetToken(wallet)
                  return (
                    <div
                      key={i}
                      className={clsx(
                        'p-3 transition-all hover:text-gray-500 cursor-pointer',
                        currentWallet?.id == wallet.id ? '!text-primary' : '',
                        i === 1 ? 'border-x' : '',
                        i === wallets.length - 1 ? '!border-r-0' : ''
                      )}
                      onClick={() => {
                        setCurrentWallet(wallet?.address!)
                      }}
                    >
                      <div className="truncate">{wallet.name}</div>
                      <div className="text-sm text-gray-500">
                        {numeral(
                          formatUnits(
                            BigInt(platformToken!.amount),
                            platformToken!.decimals
                          )
                        ).format('0,0.00')}
                        {platformToken?.symbol}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </>
    )
    // }
  }

  return (
    <MessageBubble className={`min-w-[350px]`}>
      <div className="font-bold mt-1 mb-1">
        {(isBuy ? t('tx.token.text1') : t('tx.token2')).replace(
          '$1',
          data.from_token_name
        )}
      </div>
      <div className="flex items-center">
        <div>
          <OutlinedInput
            className="!rounded-xl max-w-[150px]"
            classes={{
              input: '!py-0 !leading-none !block',
              root: '!pr-3',
            }}
            type="number"
            size="small"
            placeholder={t('custom')}
            endAdornment={
              <div className="h-full leading-none py-[14px] text-sm border-l-2 text-nowrap pl-3">
                {data.from_token_name.toUpperCase()}
              </div>
            }
            value={buyValue}
            disabled={disbaled}
            onChange={({ target }) => setBuyValue(Number(target.value))}
          ></OutlinedInput>
        </div>
        <FaArrowRightLong
          size={26}
          className="mx-5 text-gray-700"
        ></FaArrowRightLong>
        <div className="border rounded-xl py-[10px] px-6 text-sm">
          {data.to_token_name.toUpperCase()}
        </div>
      </div>

      {/* <div className="flex items-center text-sm">
        <CopyToClipboard
          text={data.from_token_contract}
          onCopy={() => toast.success(t('copy-success'))}
        >
          <div className="flex items-center mt-1 text-sm cursor-pointer text-gray-500 hover:text-gray-700">
            {utilFmt.addr(data.from_token_contract)}
            <IoCopyOutline size={14} className="ml-1"></IoCopyOutline>
          </div>
        </CopyToClipboard>
        <div className='mx-5'></div>
        <CopyToClipboard
          text={data.to_token_contract}
          onCopy={() => toast.success(t('copy-success'))}
        >
          <div className="flex items-center cursor-pointer text-gray-500 hover:text-gray-700">
            {utilFmt.addr(data.to_token_contract)}
            <IoCopyOutline size={14} className="ml-1"></IoCopyOutline>
          </div>
        </CopyToClipboard>
      </div> */}
      <div
        className={clsx(
          'flex items-center mt-3 text-sm text-gray-500',
          disbaled && 'pointer-events-none'
        )}
      >
        <div className="inline-flex justify-start border rounded-xl overflow-hidden">
          {rate.map((item, i) => {
            return (
              <div
                className={clsx(
                  'py-2 px-4 cursor-pointer transition-all hover:bg-slate-100',
                  item == curRate ? '!bg-slate-200' : '',
                  i == 1 ? 'border-x' : ''
                )}
                onClick={() => handleRateClick(item)}
              >
                {item}%
              </div>
            )
          })}
        </div>
        <div className="ml-2">
          {t('total')}
          {numeral(
            formatUnits(
              BigInt(fromToken?.amount ?? 0),
              fromToken?.decimals ?? 0
            )
          ).format('0,0.00')}
          {fromToken?.symbol}
        </div>
      </div>

      {getWalllet()}

      <div className="mt-5 flex">
        <div className="pb-5">
          <div className="font-bold mb-1">{t('slippage')}</div>
          <OutlinedInput
            className="!rounded-xl w-[110px]"
            classes={{
              input: '!py-0 !leading-none !block',
              root: '!pr-4',
            }}
            disabled={disbaled}
            type="number"
            size="small"
            placeholder={t('custom')}
            endAdornment={
              <div className="h-full leading-none py-[14px] text-sm border-l-2 text-nowrap pl-4">
                %
              </div>
            }
            value={slippage}
            onChange={({ target }) => setSlippage(Number(target.value))}
          ></OutlinedInput>
          {slippage < 0.05 ? (
            <div className="mt-1 text-yellow-500 text-sm">
              {t('slippage.warning')}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-center ml-5 text-sm text-green-600 leading-6">
          {validateErr.map((error) => {
            return <div>{error}</div>
          })}
        </div>
      </div>
      <Button
        variant="contained"
        className="!mb-2 !rounded-full"
        onClick={onConfirm}
        disabled={loading || disbaled}
      >
        {loading ? (
          <CircularProgress size={16} className="mr-2"></CircularProgress>
        ) : (
          <IoFlash></IoFlash>
        )}
        <span className="ml-1">
          {disbaled
            ? t('tx.finally')
            : loading
            ? t('tx.loading')
            : t('confirm')}
        </span>
      </Button>
    </MessageBubble>
  )
}
