import React, { useEffect } from 'react'
import { InputBase, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import clsx from 'clsx'

import ImageUploader from '@/components/image-uploader'

enum HotToken {
  WIF = 100_000_000,
  BOME = 68_999_649_476,
}

interface Props extends React.ComponentProps<'div'> {
  symbol: string
  name: string
  intro: string
  total: number
  onSymbolChange: (symbol: string) => void
  onNameChange: (name: string) => void
  onIntroChange: (intro: string) => void
  onTotalChange: (total: number) => void
}

export const CreateTokenForm = (props: Props) => {
  const {
    symbol,
    name,
    total,
    intro,
    onSymbolChange,
    onNameChange,
    onTotalChange,
    onIntroChange,
  } = props
  const { t } = useTranslation()

  return (
    <>
      {/* Symbol/name/logo */}
      <div className="flex justify-between mt-4">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="mb-1">{t('token-symbol')}*</div>
            <TextField
              size="small"
              autoComplete="off"
              value={symbol}
              onChange={({ target }) => onSymbolChange(target.value)}
            />
          </div>
          <div className="flex flex-col">
            <div className="mb-1">{t('token-fullname')}*</div>
            <TextField
              size="small"
              autoComplete="off"
              value={name}
              onChange={({ target }) => onNameChange(target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col mr-4">
          <div className="mb-1">{t('token-logo')}</div>
          <ImageUploader />
        </div>
      </div>
      {/* Total supply */}
      <div className="mt-4 w-[360px]">
        <div className="mb-1 flex justify-between items-center">
          <div>{t('token-total-supply')}*</div>
          <div className="flex items-center">
            <div
              className="text-primary text-sm mr-3 cursor-pointer"
              onClick={() => onTotalChange(HotToken.WIF)}
            >
              {t('same-wif')}
            </div>
            <div
              className="text-primary text-sm cursor-pointer"
              onClick={() => onTotalChange(HotToken.BOME)}
            >
              {t('same-bome')}
            </div>
          </div>
        </div>
        <TextField
          size="small"
          autoComplete="off"
          classes={{ root: 'w-full' }}
          value={numeral(total).format(',')}
          onChange={({ target }) => {
            const num = numeral(target.value).value()

            if (!num || Number.isNaN(num) || num < 0) return
            onTotalChange(num)
          }}
        />
      </div>
      {/* Introduction */}
      <div className="mt-4 w-[360px]">
        <div className="mb-1">{t('token-intro')}</div>
        <InputBase
          classes={{
            root: clsx(
              'w-full !border !border-gray-400 !rounded !px-2 !py-2 !text-base',
              'hover:!border-black focus-within:outline focus-within:outline-1',
              'focus-within:outline-primary focus-within:!border-primary',
              'focus-within:hover:!border-primary'
            ),
          }}
          multiline
          size="small"
          rows={3}
          autoComplete="off"
          placeholder={t('token-intro.placeholder')}
          value={intro}
          onChange={({ target }) => onIntroChange(target.value)}
        />
      </div>
    </>
  )
}

export default CreateTokenForm
