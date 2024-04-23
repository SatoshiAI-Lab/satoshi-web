import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CircularProgress, OutlinedInput } from '@mui/material'
import { IoFlash } from 'react-icons/io5'
import { formatUnits } from 'viem'
import { FaArrowRightLong } from 'react-icons/fa6'
import { BigNumber } from 'bignumber.js'
import clsx from 'clsx'
import numeral from 'numeral'
import toast from 'react-hot-toast'

import { CHAT_CONFIG } from '@/config/chat'
import { useTxToken } from '@/hooks/use-tx-tokne'
import { WalletList } from './wallet-list'
import { SelectToken } from './select-token'
import { WalletCardProps } from '@/stores/use-wallet-store'
import { useShow } from '@/hooks/use-show'
import { trandApi } from '@/api/trand'
import { useWallet } from '@/hooks/use-wallet'
import { interactiveApi } from '@/api/interactive'
import MessageBubble from '../../message-bubble'
import { useChatStore } from '@/stores/use-chat-store'

import type { ChatResponseMeta, ChatResponseTxConfrim } from '@/api/chat/types'
import { WalletChain } from '@/config/wallet'

interface Props {
  msg: ChatResponseMeta
}

const reuslt = {
  from_token_info: [
    //用户选择用哪条链的主币来购买，只返回币种支持的链
    {
      chain_name: WalletChain.OP, //代币链名 如BSC
      token_name: 'ETH', //代币名称 如BNB
      contract: '0x0000000000000000000000000000000000000000', //代币合约地址
      chain_id: 10, //平台ID
      chain_logo: 'https://img.mysatoshi.ai/chains/logo/optimism.png', //链logo
    },
  ],
  amount: 1, //想花多少主币来买
  to_token_name: 'USDC', //想买的币的币种名称
  to_token_info: [
    //想买的币在各链上的信息
    {
      chain_name: WalletChain.OP, //代币链名 如BSC
      token_name: 'USDC', //代币名称 如BNB
      contract: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', //代币合约地址
      chain_id: 10, //平台ID
      chain_logo: 'https://img.mysatoshi.ai/chains/logo/optimism.png', //链logo
    },
  ],
}

const rates = [20, 50, 100]
export const TxTokenBubbles = (props: Props) => {
  const data = (reuslt || props.msg.data) as unknown as ChatResponseTxConfrim
  const isBuy = props.msg.type == CHAT_CONFIG.metadataType.transactionConfirmBuy
  const [buyValue, setBuyValue] = useState(data.amount)
  const [slippage, setSlippage] = useState(5)
  const [curRate, setCurRate] = useState(-1)
  const [validateErr, setValidateErr] = useState<string[]>([])
  const [isFinalTx, setIsFinalTx] = useState(false)
  const { show: loading, open: showLoading, hidden: hiddenLoading } = useShow()
  const { getAllWallet } = useWallet()
  // const { addMessage } = useChatMigrating()
  const { addMessage } = useChatStore()

  const { t } = useTranslation()

  const {
    selectToken,
    sortedCheckedWalletList,
    walletList,
    tokenList,
    selectWallet,
    setSelectWallet,
    setSelectToken,
  } = useTxToken({
    isBuy,
    data,
  })

  const getSelectTokenInfo = (wallet?: WalletCardProps) => {
    return wallet?.tokens?.find((t) => t.address == selectToken?.contract)
  }

  const selectWalletToken = getSelectTokenInfo(selectWallet)

  const handleRateClick = (rate: number) => {
    if (!selectWalletToken) return
    const { amount, decimals } = selectWalletToken
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )
    const buyAmount = BigNumber(balance).multipliedBy(rate / 100)
    setCurRate(rate)
    setBuyValue(+buyAmount.toFixed(5))
  }

  const checkForm = () => {
    let error: string[] = []

    if (buyValue <= 0) {
      error.push(t('tx.form.error1'))
    }

    const { amount = 0, decimals = 0 } = selectWalletToken ?? {}
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )

    if (buyValue > balance) {
      error.push(t('tx.form.error2'))
    }

    if (slippage <= 0.05) {
      error.push(t('tx.form.error3'))
    }

    setValidateErr(error)

    return error.length === 0
  }

  const onConfirm = async () => {
    if (!checkForm()) return

    showLoading()

    const getToken = (isFrom: boolean) => {
      if (isFrom) {
        return selectToken
      } else {
        // return data.to_token_info.find(
        //   (t) => t.platform_id == selectToken?.platform_id
        // )
      }
    }

    const inputToken = getToken(true)
    const outputToken = getToken(false)

    try {
      const { data } = await trandApi.swapToken(selectWallet.id!, {
        chain: inputToken?.chain,
        amount: `${buyValue}`,
        input_token: `${inputToken?.contract}`,
        output_token: `${outputToken?.contract}`,
        slippageBps: slippage,
      })

      const getStatus = async () => {
        const { data: result } = await interactiveApi.getHashStatus({
          hash_tx: data.hash_tx,
          chain: inputToken?.chain,
        })
        if (result.status == 0) {
          await getStatus()
          return
        }
        if (result.status == 1) {
          toast.success(t('trading.success'))
          return
        }
        if (result.status == 2) {
          toast.error(t('trading.timeout'))
          return Promise.reject()
        }
        if (result.status == 3) {
          toast.error(t('trading.fail'))
          return Promise.reject()
        }
      }

      await getStatus()
      addMessage({ text: `${t('successful.transaction')}${data.hash_tx}` })
      setIsFinalTx(true)
      getAllWallet()
    } catch {
      toast.error(t('trading.fail'))
    } finally {
      hiddenLoading()
    }
  }

  return (
    <MessageBubble className={`min-w-[350px]`}>
      <div className="font-bold mt-1 mb-1">
        {(isBuy ? t('tx.token.text1') : t('tx.token2')).replace(
          '$1',
          selectToken?.token_name ?? ''
        )}
      </div>
      <div className="flex items-center">
        <div>
          <OutlinedInput
            className={clsx(
              '!rounded-xl max-w-[150px]',
              `${isBuy ? 'max-w-[180px]' : ''}`
            )}
            classes={{
              input: '!py-0 !leading-none !block',
              root: '!pr-3',
            }}
            type="number"
            size="small"
            placeholder={t('custom')}
            endAdornment={
              isBuy ? (
                <SelectToken
                  isFrom
                  isBuy
                  tokenList={tokenList}
                  selectToken={selectToken}
                  switchToken={setSelectToken}
                  data={data}
                  isFinalTx={isFinalTx}
                ></SelectToken>
              ) : (
                <div
                  className={clsx(
                    'h-full leading-none py-[14px] text-sm border-l-2 text-nowrap pl-3'
                  )}
                >
                  {data.from_token_name}
                </div>
              )
            }
            value={buyValue}
            disabled={isFinalTx}
            onChange={({ target }) => setBuyValue(Number(target.value))}
          ></OutlinedInput>
        </div>
        <FaArrowRightLong
          size={26}
          className="mx-5 text-gray-700"
        ></FaArrowRightLong>
        <SelectToken
          isFrom={false}
          isBuy={isBuy}
          tokenList={tokenList}
          selectToken={selectToken}
          switchToken={setSelectToken}
          data={data}
          isFinalTx={isFinalTx}
        ></SelectToken>
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
          isFinalTx && 'pointer-events-none'
        )}
      >
        <div className="inline-flex justify-start border rounded-xl overflow-hidden">
          {rates.map((rate, i) => {
            return (
              <div
                key={i}
                className={clsx(
                  'py-2 px-4 cursor-pointer transition-all hover:bg-slate-100',
                  rate == curRate ? '!bg-slate-200' : '',
                  i == 1 ? 'border-x' : ''
                )}
                onClick={() => handleRateClick(rate)}
              >
                {rate}%
              </div>
            )
          })}
        </div>
        <div className="ml-2">
          {t('total')}
          {Number(
            numeral(
              formatUnits(
                BigInt(selectWalletToken?.amount ?? 0),
                selectWalletToken?.decimals ?? 0
              )
            ).format('0.0000')
          )}
          {selectWalletToken?.symbol}
        </div>
      </div>

      <WalletList
        gridWalletList={walletList}
        selectWallet={selectWallet}
        isFinalTx={isFinalTx}
        walletList={sortedCheckedWalletList}
        onSelectWallet={(w) => setSelectWallet(w)}
        getSelectTokenInfo={getSelectTokenInfo}
      ></WalletList>

      <div className="mt-5 flex">
        <div className="pb-5">
          <div className="font-bold mb-1">{t('slippage')}</div>
          <OutlinedInput
            className="!rounded-xl w-[110px]"
            classes={{
              input: '!py-0 !leading-none !block',
              root: '!pr-4',
            }}
            disabled={isFinalTx}
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
        disabled={loading || isFinalTx}
      >
        {loading ? (
          <CircularProgress size={16} className="mr-2"></CircularProgress>
        ) : (
          <IoFlash></IoFlash>
        )}
        <span className="ml-1">
          {isFinalTx
            ? t('tx.finally')
            : loading
            ? t('tx.loading')
            : t('confirm')}
        </span>
      </Button>
    </MessageBubble>
  )
}
