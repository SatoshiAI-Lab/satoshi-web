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
import { ResponseCode } from '@/api/fetcher/types'
import { utilFmt } from '@/utils/format'

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
  isInitCrossFee: boolean

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
  crossFeeLoading: true,
  isInitCrossFee: true,
  onConfirm: () => {},
  showSwaping: () => {},
  closeSwaping: () => {},
  setSlippage: () => {},
  setBuyValue: () => {},
  setCurRate: () => {},
  handleRateClick: (rate) => {},
  getSelectTokenInfo: (wallet) => undefined,
})

export const useSwapConfirmLogic = ({
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

  const {
    data: crossFeeData,
    isLoading: isInitCrossFee,
    isFetching: crossFeeLoading,
  } = useQuery({
    queryKey: [
      selectFromToken,
      selectToToken,
      setValidateErr,
      buyValue,
      slippage,
    ],
    queryFn: async () => {
      if (selectToToken?.chain.id === selectFromToken?.chain.id) {
        return {} as CrossFeeData
      }

      if (!selectFromToken || !selectToToken || !buyValue) {
        return {} as CrossFeeData
      }

      try {
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
        return data
      } catch (result: any) {
        const { code, data } = result.data
        const handleError = (errorText: string, errorType: string) => {
          if (!validateErr.find(({ type }) => type === errorType)) {
            validateErr.push({
              type: errorType,
              errorText,
            })
          }

          setValidateErr(validateErr)
        }
        switch (code) {
          case ResponseCode.CrossChianPath: {
            const errorText = t('not.supported')
              .replace('$1', selectFromToken.chain.name)
              .replace('$2', selectToToken.chain.name)
            handleError(errorText, SwapError.crossChainNotSupper)
            break
          }
          case ResponseCode.CrossChianMaxAmout: {
            const errorText = t('cross.chain.max')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            handleError(errorText, SwapError.crossChaiMaxAmount)
            break
          }
          case ResponseCode.CrossChianMinAmout: {
            const errorText = t('cross.chain.min')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            handleError(errorText, SwapError.crossChaiMinAmount)
            break
          }
          case ResponseCode.CrossChianLiquidity: {
            const errorText = t('cross.chain.liquidity')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            handleError(errorText, SwapError.crossChainLiquidity)
            break
          }
        }

        return undefined
      }
    },
  })

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
    const bridge_id = crossFeeData.provider_data.bridge_id!

    const loading = toast.loading(t('cross.chain.loading'))

    try {
      const { code, data } = await trandApi.crossSwap(fromWallet?.id!, {
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
        provider: crossFeeData.provider,
        providerData: {
          approval_address,
          bridge_id,
        },
      })

      addMessage({
        role: 'assistant',
        text: `${t('tx.sned')}${data.url}`,
      })

      const getStatus = async () => {
        if (code != 200) return

        try {
          const { data: result } = await interactiveApi.getCrossHashStatus({
            hash_tx: data.hash_tx,
            provider: data.provider,
            chain: selectFromToken.chain.name,
          })

          if (result.status === 'PENDING') {
            await getStatus()
          }

          if (result.status === 'SUCCESS') {
            toast.success(t('cross.chain.success'))
            return
          }

          if (result.status === 'FAILURE' || result.status === 'REFUND') {
            toast.error(t('trading.fail'))
            return Promise.reject()
          }
        } catch (e) {
          console.log('报错了')
        }
      }

      const handlerError = () => {
        const pushError = (errorText: string, errorType: string) => {
          if (!validateErr.find(({ type }) => type === errorType)) {
            validateErr.push({
              type: errorType,
              errorText,
            })
          }

          setValidateErr(validateErr)
        }

        switch (code) {
          case ResponseCode.CrossChianPath: {
            const errorText = t('not.supported')
              .replace('$1', selectFromToken!.chain.name)
              .replace('$2', selectToToken!.chain.name)
            pushError(errorText, SwapError.crossChainNotSupper)
            break
          }
          case ResponseCode.CrossChianMaxAmout: {
            const errorText = t('cross.chain.max')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            pushError(errorText, SwapError.crossChaiMaxAmount)
            break
          }
          case ResponseCode.CrossChianMinAmout: {
            const errorText = t('cross.chain.min')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            pushError(errorText, SwapError.crossChaiMinAmount)
            break
          }
          case ResponseCode.CrossChianLiquidity: {
            const errorText = t('cross.chain.liquidity')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            pushError(errorText, SwapError.crossChainLiquidity)
            break
          }
        }
      }

      handlerError()
      await getStatus()
    } catch (e) {
      toast.error(t('trading.fail'))
    } finally {
      toast.dismiss(loading)
    }
  }

  const onConfirm = async () => {
    if (!checkForm()) return
    showSwaping()

    try {
      if (selectFromToken?.chain.id === selectToToken?.chain.id) {
        await baseSwap()
      } else {
        await crossSwap()
      }
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
  }, [fromWallet, selectFromToken])

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
    isInitCrossFee,
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

  return {
    txLogigcContextValue,
    ...txLogigcContextValue,
  }
}