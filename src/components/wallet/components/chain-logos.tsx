import { Tooltip } from '@mui/material'

import type { PartialWalletRes } from '@/stores/use-wallet-store'

export const ChainLogos = (props: { wallet: PartialWalletRes }) => {
  const { chain } = props.wallet

  return (
    <Tooltip
      title={chain?.name}
      classes={{ tooltip: 'first-letter:uppercase' }}
    >
      <img src={chain?.logo ?? ''} width={24} height={24} alt="logo" />
    </Tooltip>
  )
}

export default ChainLogos
