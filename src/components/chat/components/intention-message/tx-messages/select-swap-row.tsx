import clsx from 'clsx'

import { t } from 'i18next'
import { OutlinedInput } from '@mui/material'
import { VscArrowSwap } from 'react-icons/vsc'
import { SelectToken } from './select-token'
import { useContext } from 'react'

import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { utilFmt } from '@/utils/format'

export const SelectSwapRow = () => {
  const {
    selectFromToken,
    selectToToken,
    toTokenList,
    fromTokenList,
    intentTokenInfo,
    setFromTokenList,
    setToTokenList,
    setSelectFromToken,
    setSelectToToken,
  } = useContext(SwapContext)
  const { buyValue, isFinalTx, setBuyValue } = useContext(TxLogicContext)

  const onSwitch = () => {
    const {
      fromIntentChain,
      fromTokenInfo,
      toIntentChain,
      toTokenInfo,
      setFromIntentChain,
      setFromTokenInfo,
      setToIntentChain,
      setToTokenInfo,
    } = intentTokenInfo!

    setSelectToToken(selectFromToken)
    setToTokenList(fromTokenList)

    setSelectFromToken(selectToToken)
    setFromTokenList(toTokenList)

    setFromIntentChain(toIntentChain)
    setToIntentChain(fromIntentChain)
    setFromTokenInfo(toTokenInfo)
    setToTokenInfo(fromTokenInfo)
  }

  return (
    <>
      <div className="font-bold mt-1 mb-1">
        {t('tx.token.text')
          .replace(
            '$1',
            selectFromToken?.symbol || intentTokenInfo?.fromTokenInfo || ''
          )
          .replace(
            '$2',
            selectToToken?.symbol || intentTokenInfo?.toTokenInfo || ''
          )}
      </div>
      <div className="flex justify-start items-center">
        <OutlinedInput
          className={clsx('!rounded-xl flex-shrink-0 flex-1')}
          classes={{
            input: '!py-0 !leading-none !w-[75px] flex-shrink-0',
            root: '!pr-3',
          }}
          type="number"
          size="small"
          placeholder={t('custom')}
          endAdornment={
            <SelectToken isFrom isFinalTx={isFinalTx}></SelectToken>
          }
          value={buyValue}
          disabled={isFinalTx}
          onChange={({ target }) => setBuyValue(Number(target.value))}
        ></OutlinedInput>
        <VscArrowSwap
          size={26}
          className="mx-5 text-gray-700 cursor-pointer"
          onClick={onSwitch}
        ></VscArrowSwap>
        <SelectToken isFrom={false} isFinalTx={isFinalTx}></SelectToken>
      </div>
    </>
  )
}
