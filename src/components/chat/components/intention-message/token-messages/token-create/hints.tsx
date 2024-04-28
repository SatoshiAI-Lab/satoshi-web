import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props extends React.ComponentProps<'div'> {
  symbolIsValid: boolean
  nameIsValid: boolean
  totalIsValid: boolean
}

export const TokenCreateHints = (props: Props) => {
  const { symbolIsValid, nameIsValid, totalIsValid } = props
  const { t } = useTranslation()

  return (
    <div className="my-4">
      {!symbolIsValid && (
        <div className="text-rise text-sm">
          <span className="text-thirdly">●</span> {t('token-nickname-validate')}
        </div>
      )}
      {!nameIsValid && (
        <div className="text-rise text-sm my-1">
          <span className="text-thirdly">●</span> {t('token-fullname-validate')}
        </div>
      )}
      {!totalIsValid && (
        <div className="text-rise text-sm">
          <span className="text-thirdly">●</span> {t('token-total-validate')}
        </div>
      )}
    </div>
  )
}

export default TokenCreateHints
