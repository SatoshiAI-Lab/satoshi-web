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

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react'
import {
  ChatResponseTxConfrim,
  ChatResponseWalletListToken,
  MultiChainCoin,
} from '@/api/chat/types'
import { useQuery } from '@tanstack/react-query'
import { CrossFeeData } from '@/api/trand/types'
import { SwapError } from '@/config/swap-error'

interface Options {
  data: ChatResponseTxConfrim
  selectFromToken?: MultiChainCoin
  selectToToken?: MultiChainCoin
  fromWallet?: PartialWalletRes
  receiveWallet?: PartialWalletRes
}

export interface ValidateError {
  type: string
  errorText: string
}

export interface ITxLogicContext {
  curRate: number
  isFinalTx: boolean
  validateErr: ValidateError[]
  isSwaping: boolean
  buyValue: number
  slippage: number
  crossFeeData?: CrossFeeData
  crossFeeLoading: boolean

  onConfirm: () => any
  showSwaping: () => void
  closeSwaping: () => void
  setSlippage: Dispatch<SetStateAction<number>>
  setBuyValue: Dispatch<SetStateAction<number>>
  setCurRate: Dispatch<SetStateAction<number>>
  handleRateClick: (rate: number) => void
  getSelectTokenInfo: (
    wallet?: PartialWalletRes,
    token?: MultiChainCoin
  ) => ChatResponseWalletListToken | undefined
}

export const rates = [20, 50, 100]

export const TxLogicContext = createContext<ITxLogicContext>({
  curRate: 0,
  isFinalTx: false,
  validateErr: [],
  isSwaping: false,
  buyValue: 0,
  slippage: 0,
  crossFeeData: undefined,
  crossFeeLoading: false,
  onConfirm: () => {},
  showSwaping: () => {},
  closeSwaping: () => {},
  setSlippage: () => {},
  setBuyValue: () => {},
  setCurRate: () => {},
  handleRateClick: (rate) => {},
  getSelectTokenInfo: (wallet) => undefined,
})

export const useTxLogic = ({
  data,
  fromWallet,
  selectFromToken,
  selectToToken,
  receiveWallet,
}: Options) => {
  const [buyValue, setBuyValue] = useState(data.amount)
  const [slippage, setSlippage] = useState(5)
  const [curRate, setCurRate] = useState(20)
  const [validateErr, setValidateErr] = useState<ValidateError[]>([])
  const [isFinalTx, setIsFinalTx] = useState(false)
  const { show: isSwaping, open: showSwaping, hidden: closeSwaping } = useShow()

  const { getAllWallet } = useWalletList()
  const { addMessage } = useChatStore()

  const { data: crossFeeData, isFetching: crossFeeLoading } = useQuery({
    queryKey: [selectFromToken, selectToToken, setValidateErr],
    queryFn: async () => {
      if (selectToToken?.chain.id === selectFromToken?.chain.id) {
        return
      }

      if (!selectFromToken || !selectToToken || !buyValue) {
        return undefined
      }

      const { code, data } = await trandApi.getCrossFee({
        crossAmount: `${buyValue || 0.00001}`,
        fromData: {
          chain: selectFromToken.chain.name,
          tokenAddress: selectFromToken.address,
        },
        slippageBps: slippage * 100,
        toData: {
          chain: selectToToken.chain.name,
          tokenAddress: selectToToken.address,
        },
      })

      if (code != 200) {
        const errorText = t('not.supported')
          .replace('$1', selectFromToken.chain.name)
          .replace('$2', selectToToken.chain.name)

        if (
          !validateErr.find(
            ({ type }) => type === SwapError.crossChainNotSupper
          )
        ) {
          validateErr.push({
            type: SwapError.crossChainNotSupper,
            errorText,
          })
        }

        setValidateErr(validateErr)
      }

      return data
    },
    refetchInterval: 15 * 1000,
  })

  console.log(crossFeeLoading)

  const getSelectTokenInfo = (
    wallet?: PartialWalletRes,
    token?: MultiChainCoin
  ) => {
    return wallet?.tokens?.find((t) => t.address == token?.address)
  }

  const selectWalletToken = getSelectTokenInfo(fromWallet!, selectFromToken!)

  const handleRateClick = (rate: number) => {
    if (!selectWalletToken) return
    const { amount, decimals } = selectWalletToken
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )

    if (rate == 100) {
      setBuyValue(+balance)
      setCurRate(rate)
      return
    }

    const buyAmount = BigNumber(balance).multipliedBy(rate / 100)
    setCurRate(rate)
    setBuyValue(+buyAmount.toFixed(buyAmount.toNumber() > 100 ? 0 : 5))
  }

  const checkForm = () => {
    let error: ValidateError[] = []

    if (buyValue <= 0) {
      error.push({
        type: SwapError.buyCost,
        errorText: t('tx.form.error1'),
      })
    }

    const { amount = 0, decimals = 0 } = selectWalletToken ?? {}
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )
    if (buyValue > balance) {
      error.push({
        type: SwapError.insufficient,
        errorText: t('tx.form.error2'),
      })
    }

    if (slippage <= 0.05) {
      error.push({
        type: SwapError.slippage,
        errorText: t('tx.form.error3'),
      })
    }

    setValidateErr(error)

    return error.length === 0
  }

  // 单链交易
  const baseSwap = async () => {
    const amount = BigNumber(buyValue).multipliedBy(0.93).toFixed(5)

    const { data } = await trandApi.swapToken(fromWallet?.id!, {
      chain: selectFromToken?.chain.name,
      amount: `${amount}`,
      input_token: `${selectFromToken?.address}`,
      output_token: `${selectToToken?.address}`,
      slippageBps: slippage,
    })

    addMessage({
      role: 'assistant',
      text: `${t('tx.sned')}${data.url}`,
    })

    const getStatus = async () => {
      const { data: result } = await interactiveApi.getHashStatus({
        hash_tx: data.hash_tx,
        chain: selectFromToken?.chain.name,
      })
      if (result.status == 0) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null)
          }, 1500)
        })
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
  }

  // 跨链交易
  const crossSwap = async () => {
    const amount = BigNumber(buyValue).multipliedBy(0.93).toFixed(5)

    if (!selectFromToken || !selectToToken || !crossFeeData || !receiveWallet) {
      console.log('Transaction parameter missing')
      return
    }

    const approval_address =
      crossFeeData.provider_data.cross_chain_fee_token_address!

    const { data } = await trandApi.crossSwap(fromWallet?.id!, {
      crossAmount: amount,
      fromData: {
        chain: selectFromToken.chain.name,
        tokenAddress: selectFromToken.address,
      },
      toData: {
        chain: selectToToken.chain.name,
        tokenAddress: selectToToken.address,
        walletAddress: receiveWallet.address!,
      },
      // 默认为 10% 即 1000；1 为 0.01%
      slippageBps: slippage * 100,
      providerData: {
        approval_address,
      },
    })
  }

  const onConfirm = async () => {
    if (!checkForm()) return
    showSwaping()

    try {
      if (selectFromToken?.chain.id === selectToToken?.chain.id) {
        baseSwap()
      } else {
        crossSwap()
      }
    } catch {
      toast.error(t('trading.fail'))
    } finally {
      closeSwaping()
    }
  }

  useEffect(() => {
    handleRateClick(curRate)
  }, [fromWallet])

  useEffect(() => {
    checkForm()
  }, [selectWalletToken, buyValue, slippage])

  useEffect(() => {
    if (!selectWalletToken) return
    const { amount, decimals } = selectWalletToken
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )

    if (balance === buyValue) {
      setCurRate(100)
      return
    }

    for (const rate of rates) {
      const buyAmount = BigNumber(balance).multipliedBy(rate / 100)
      const value = buyAmount.toFixed(buyAmount.toNumber() > 100 ? 0 : 5)

      if (+value === buyValue) {
        setCurRate(rate)
        return
      }
    }

    setCurRate(0)
  }, [buyValue])

  const txLogigcContextValue = {
    curRate,
    isFinalTx,
    validateErr,
    isSwaping,
    buyValue,
    slippage,
    crossFeeData,
    crossFeeLoading,
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
