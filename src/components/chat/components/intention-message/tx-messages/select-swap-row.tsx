import clsx from 'clsx'

import { t } from 'i18next'
import { OutlinedInput } from '@mui/material'
import { FaArrowRightLong } from 'react-icons/fa6'
import { SelectToken } from './select-token'
import { useContext } from 'react'

import { SwapContext, TxLogicContext } from '@/hooks/use-swap/context'

export const SelectSwapRow = () => {
  const { isBuy, selectFromToken, replaceWithETHInfo } = useContext(SwapContext)
  const { buyValue, isFinalTx, setBuyValue } = useContext(TxLogicContext)

  return (
    <>
      <div className="font-bold mt-1 mb-1">
        {(isBuy ? t('tx.token.text1') : t('tx.token2')).replace(
          '$1',
          selectFromToken?.symbol ?? ''
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
            <SelectToken isFrom isBuy isFinalTx={isFinalTx}></SelectToken>
          }
          value={buyValue}
          disabled={isFinalTx}
          onChange={({ target }) => setBuyValue(Number(target.value))}
        ></OutlinedInput>
        <FaArrowRightLong
          size={26}
          className="mx-5 text-gray-700"
        ></FaArrowRightLong>
        <SelectToken
          isFrom={false}
          isBuy={isBuy}
          isFinalTx={isFinalTx}
        ></SelectToken>
      </div>
      {replaceWithETHInfo ? (
        <div className="text-yellow-500 text-sm mt-2">{replaceWithETHInfo}</div>
      ) : null}
    </>
  )
}
