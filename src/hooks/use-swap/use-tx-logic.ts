import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import toast from 'react-hot-toast'

import { t } from 'i18next'
import { interactiveApi } from '@/api/interactive'
import { trandApi } from '@/api/trand'
import { PartialWalletRes } from '@/stores/use-wallet-store'
import { formatUnits } from 'viem'
import { useShow } from '../use-show'
import { useChatStore } from '@/stores/use-chat-store'
import { useWalletList } from '../use-wallet-list'

import { useEffect, useState } from 'react'
import { ChatResponseTxConfrim, MultiChainCoin } from '@/api/chat/types'

interface Options {
  data: ChatResponseTxConfrim
  selectFromToken?: MultiChainCoin
  selectToToken?: MultiChainCoin
  currentWallet?: PartialWalletRes
}

export const useTxLogic = ({
  data,
  currentWallet,
  selectFromToken,
  selectToToken,
}: Options) => {
  const [buyValue, setBuyValue] = useState(data.amount)
  const [slippage, setSlippage] = useState(5)
  const [curRate, setCurRate] = useState(0)
  const [validateErr, setValidateErr] = useState<string[]>([])
  const [isFinalTx, setIsFinalTx] = useState(false)
  const { show: isSwaping, open: showSwaping, hidden: closeSwaping } = useShow()

  const { getAllWallet } = useWalletList()
  const { addMessage } = useChatStore()

  const getSelectTokenInfo = (
    wallet?: PartialWalletRes,
    token?: MultiChainCoin
  ) => {
    return wallet?.tokens?.find((t) => t.address == token?.address)
  }

  const selectWalletToken = getSelectTokenInfo(currentWallet!, selectFromToken!)

  const handleRateClick = (rate: number) => {
    if (!selectWalletToken) return
    const { amount, decimals } = selectWalletToken
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )
    const buyAmount = BigNumber(balance).multipliedBy(rate / 100)
    setCurRate(rate)
    setBuyValue(+buyAmount.toFixed(buyAmount.toNumber() > 100 ? 0 : 5))
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

    showSwaping()

    const getToken = (isFrom: boolean) => {
      if (isFrom) {
        return selectFromToken
      } else {
        return selectToToken
      }
    }

    const inputToken = getToken(true)
    const outputToken = getToken(false)

    try {
      const amount = BigNumber(buyValue).multipliedBy(0.93).toFixed(5)

      const { data } = await trandApi.swapToken(currentWallet?.id!, {
        chain: inputToken?.chain.name,
        amount: `${amount}`,
        input_token: `${inputToken?.address}`,
        output_token: `${outputToken?.address}`,
        slippageBps: slippage,
      })

      addMessage({
        role: 'assistant',
        text: `${t('tx.sned')}${data.url}`,
      })

      const getStatus = async () => {
        const { data: result } = await interactiveApi.getHashStatus({
          hash_tx: data.hash_tx,
          chain: inputToken?.chain.name,
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
      setIsFinalTx(true)
      getAllWallet()
    } catch {
      toast.error(t('trading.fail'))
    } finally {
      closeSwaping()
    }
  }

  useEffect(() => {
    handleRateClick(curRate)
  }, [currentWallet])

  const txLogigcContextValue = {
    curRate,
    isFinalTx,
    validateErr,
    isSwaping,
    buyValue,
    slippage,
    onConfirm,
    showSwaping,
    closeSwaping,
    setSlippage,
    setBuyValue,
    handleRateClick,
    setCurRate,
    getSelectTokenInfo,
  }

  // useEffect(() => {
  //   handleRateClick(curRate)
  // }, [selectFromToken])

  return {
    txLogigcContextValue,
    ...txLogigcContextValue,
  }
}
