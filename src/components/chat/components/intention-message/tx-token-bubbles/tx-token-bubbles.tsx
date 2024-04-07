import { useTranslation } from 'react-i18next'
import MessageBubble from '../../message-bubble'
import { Button, CircularProgress, OutlinedInput } from '@mui/material'
import { IoFlash } from 'react-icons/io5'
import clsx from 'clsx'
import { useState } from 'react'
import { ChatResponseAnswerMeta, ChatResponseTxConfrim } from '@/api/chat/types'
import { trandApi } from '@/api/trand'
import { useShow } from '@/hooks/use-show'

interface Props {
  msg: ChatResponseAnswerMeta
}

export const TxTokenBubbles = (props: Props) => {
  const data = props.msg.data as unknown as ChatResponseTxConfrim
  const rawWalletList = data.match_wallets
    .sort((a, b) => {
      return new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
    })
    .slice(0, 1)

  const defaultWalletId = rawWalletList[0].id

  const { t } = useTranslation()
  const [disbaled, setDisabled] = useState(false)
  const { show: loading, open: showLoading, hidden: closeLoading } = useShow()
  const [buyValue, setBuyValue] = useState(0)
  const [slippage, setSlippage] = useState(5)
  const [walletId, setWalletId] = useState(defaultWalletId)
  const [validateErr, setValidateErr] = useState<string[]>([])

  let count = 0

  const walletList = rawWalletList.reduce<(typeof rawWalletList)[]>(
    (cur, next) => {
      if (count % 3 == 0) {
        cur.push([])
      }
      cur[cur.length - 1].push(next)
      count++
      return cur
    },
    []
  )

  const checkForm = () => {
    let error: string[] = []

    if (buyValue <= 0) {
      error.push(t('tx.form.error1'))
    }

    const wallet = rawWalletList.find((wallet) => wallet.id == walletId)!
    console.log(buyValue, wallet.value)

    if (buyValue > Number(wallet!.value)) {
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
        .buyToken(walletId, {
          amount: `${buyValue}`,
          input_token: data.from_token_contract,
          output_token: data.to_token_contract,
          platform: 'SOL',
          slippageBps: slippage,
        })
        .then(({ data }) => {
          setDisabled(true)
        })
        .finally(() => {
          closeLoading()
        })
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

        <div className="inline-block border rounded-2xl">
          {walletList.map((wallets, i) => {
            return (
              <div
                key={i}
                className={clsx(
                  'inline-grid',
                  i !== 0 ? 'border-t' : '',
                  getCols(wallets.length)
                )}
              >
                {wallets.map((wallet, i) => {
                  return (
                    <div
                      key={i}
                      className={clsx(
                        'p-3 transition-all hover:text-gray-500 cursor-pointer',
                        walletId == wallet.id ? '!text-primary' : '',
                        i === 1 ? 'border-x' : ''
                      )}
                      onClick={() => setWalletId(wallet.id)}
                    >
                      <div className="truncate">{wallet.name}</div>
                      <div className="text-sm text-gray-500">
                        {wallet.tokens[0].amount}
                        {wallet.platform}
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
    <MessageBubble
      className={`min-w-[250px] ${disbaled ? 'pointer-events-none select-none' : ''}`}
    >
      <div className="font-bold mt-1 mb-1">{t('tx.token.text1')}</div>
      <OutlinedInput
        className="!rounded-xl w-[130px]"
        classes={{
          input: '!py-0 !leading-none !block',
          root: '!pr-3',
        }}
        type="number"
        size="small"
        placeholder={t('custom')}
        endAdornment={
          <div className="h-full leading-none py-[14px] text-sm border-l-2 text-nowrap pl-3">
            SOL
          </div>
        }
        value={buyValue}
        onChange={({ target }) => setBuyValue(Number(target.value))}
      ></OutlinedInput>
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
