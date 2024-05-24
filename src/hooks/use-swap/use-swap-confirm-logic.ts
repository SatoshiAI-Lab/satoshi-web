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
  isCrossFeeError: boolean
  validateCrossErr: ValidateError[]
  setValidateCrossErr: Dispatch<SetStateAction<ValidateError[]>>

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
  isCrossFeeError: false,
  validateCrossErr: [],
  setValidateCrossErr: () => {},
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
  const [validateCrossErr, setValidateCrossErr] = useState<ValidateError[]>([])
  const [isFinalTx, setIsFinalTx] = useState(false)
  const { show: isSwaping, open: showSwaping, hidden: closeSwaping } = useShow()

  const { getAllWallet } = useWalletList()
  const { addMessage } = useChatStore()

  // 获取跨链手续费
  const {
    data: crossFeeData,
    isError: isCrossFeeError,
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

        const validateCrossErr: ValidateError[] = []

        const pushCrossError = (errorText: string, errorType: string) => {
          if (!validateCrossErr.find(({ type }) => type === errorType)) {
            validateCrossErr.push({
              type: errorType,
              errorText,
            })
          }

          setValidateCrossErr(validateCrossErr)
        }

        if (code === ResponseCode.CrossChainNotFindTranfer) {
          const errorText = t('not.find.transfer')
            .replace(
              '$1',
              utilFmt.fisrtCharUppercase(selectFromToken.chain.name)
            )
            .replace('$2', utilFmt.fisrtCharUppercase(selectFromToken.symbol))
            .replace('$3', utilFmt.fisrtCharUppercase(selectToToken.chain.name))
            .replace('$4', utilFmt.fisrtCharUppercase(selectToToken.symbol!))
          pushCrossError(errorText, SwapError.crossChainNotSupper)
        }

        if (code === ResponseCode.CrossChainPath) {
          const errorText = t('not.supported')
            .replace('$1', selectFromToken.chain.name)
            .replace('$2', selectToToken.chain.name)
          pushCrossError(errorText, SwapError.crossChainNotSupper)
        }

        if (code === ResponseCode.CrossChainMaxAmout) {
          const errorText = t('cross.chain.max')
            .replace('$1', utilFmt.token(data.minimum_amount).toString())
            .replace('$2', selectToToken.symbol)
          pushCrossError(errorText, SwapError.crossChaiMaxAmount)
        }

        if (code === ResponseCode.CrossChainMinAmout) {
          const errorText = t('cross.chain.min')
            .replace('$1', utilFmt.token(data.minimum_amount).toString())
            .replace('$2', selectFromToken.symbol)
          pushCrossError(errorText, SwapError.crossChaiMinAmount)
        }

        if (code === ResponseCode.CrossChainLiquidity) {
          const errorText = t('cross.chain.liquidity')
            .replace('$1', utilFmt.token(data.minimum_amount).toString())
            .replace('$2', selectFromToken.symbol)
          pushCrossError(errorText, SwapError.crossChainLiquidity)
        }

        setValidateCrossErr(validateCrossErr)

        return data
      } catch (result) {
        throw result
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
    let isError = false
    if (buyValue <= 0) {
      pushError(t('tx.form.error1'), SwapError.buyCost)
      isError = true
    } else {
      popError(SwapError.buyCost)
    }

    const { amount = 0, decimals = 0 } = selectWalletToken ?? {}
    const balance = +numeral(formatUnits(BigInt(amount), decimals)).format(
      '0.00000'
    )
    console.log(buyValue, balance)
    if (buyValue > balance) {
      pushError(t('tx.form.error2'), SwapError.insufficient)
      isError = true
    } else {
      popError(SwapError.insufficient)
    }

    if (slippage <= 0.05) {
      pushError(t('tx.form.error3'), SwapError.slippage)
      isError = true
    } else {
      popError(SwapError.slippage)
    }

    return isError
  }

  const pushError = (errorText: string, errorType: string) => {
    if (!validateErr.find(({ type }) => type === errorType)) {
      validateErr.push({
        type: errorType,
        errorText,
      })
    }

    setValidateErr(validateErr)
  }

  const popError = (errorType: string) => {
    const index = validateErr.findIndex(({ type }) => type === errorType)
    if (index !== -1) {
      validateErr.splice(index, 1)
    }

    setValidateErr(validateErr)
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
        text: `${t('cross.tx.sned.2').replace(
          '$1',
          selectToToken.chain.name!
        )}${data.url}`,
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
            addMessage({
              role: 'assistant',
              text: `${t('cross.tx.sned.2').replace(
                '$1',
                selectToToken.chain.name!
              )}${data.to_url}`,
            })

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
        switch (code) {
          case ResponseCode.CrossChainPath: {
            const errorText = t('not.supported')
              .replace('$1', selectFromToken!.chain.name)
              .replace('$2', selectToToken!.chain.name)
            pushError(errorText, SwapError.crossChainNotSupper)
            break
          }
          case ResponseCode.CrossChainMaxAmout: {
            const errorText = t('cross.chain.max')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            pushError(errorText, SwapError.crossChaiMaxAmount)
            break
          }
          case ResponseCode.CrossChainMinAmout: {
            const errorText = t('cross.chain.min')
              .replace('$1', utilFmt.token(data.minimum_amount).toString())
              .replace('$2', selectToToken.symbol)
            pushError(errorText, SwapError.crossChaiMinAmount)
            break
          }
          case ResponseCode.CrossChainLiquidity: {
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
      throw e
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
  }, [selectWalletToken, buyValue, slippage, setValidateErr])

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
    isCrossFeeError,
    validateCrossErr,
    setValidateCrossErr,
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
