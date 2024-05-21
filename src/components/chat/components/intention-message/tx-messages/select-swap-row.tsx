import clsx from 'clsx'

import { t } from 'i18next'
import { OutlinedInput } from '@mui/material'
import { FaArrowRightLong } from 'react-icons/fa6'
import { SelectToken } from './select-token'
import { useContext } from 'react'

import { SwapContext } from '@/hooks/use-swap/use-swap-provider'
import { TxLogicContext } from '@/hooks/use-swap/use-swap-confirm-logic'
import { utilFmt } from '@/utils/format'

export const SelectSwapRow = () => {
  const { selectFromToken, selectToToken, intentTokenInfo } =
    useContext(SwapContext)
  const { buyValue, isFinalTx, crossFeeData, setBuyValue, crossFeeLoading } =
    useContext(TxLogicContext)

  const handleCrossPlatform = () => {
    const { provider, provider_data } = crossFeeData || {}

    if (crossFeeLoading) {
      return (
        <div className="mt-2 text-sm text-gray-500 flicker-text">
          {t('cross.chain.quote')}
        </div>
      )
    }

    return Number(provider_data?.cross_chain_fee) ? (
      <div className="mt-2 text-sm text-gray-500">
        {t('cross.fee.tips')
          .replace('$1', utilFmt.fisrtCharUppercase(provider) || '')
          .replace(
            '$2',
            `${utilFmt.token(Number(provider_data?.cross_chain_fee) || 0, 2)}`
          )
          .toString()
          .replace('$3', selectFromToken?.symbol || '')}
      </div>
    ) : null
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
        <FaArrowRightLong
          size={26}
          className="mx-5 text-gray-700"
        ></FaArrowRightLong>
        <SelectToken isFrom={false} isFinalTx={isFinalTx}></SelectToken>
      </div>

      {handleCrossPlatform()}
    </>
  )
}
