import React from 'react'
import { GoArrowDown, GoArrowUp } from 'react-icons/go'
import clsx from 'clsx'

import { utilParse } from '@/utils/parse'

interface PercentTgaProps {
  percent: number
  fixed?: number
  round?: boolean
  riseSymbol?: React.ReactElement
  fallSymbol?: React.ReactElement
  showPercent?: boolean
  block?: boolean
  className?: string
}

export const PercentTag: React.FC<PercentTgaProps> = (props) => {
  const {
    percent,
    fixed = 2,
    round = true,
    riseSymbol = <GoArrowUp />,
    fallSymbol = <GoArrowDown />,
    showPercent = true,
    block = false,
    className = '',
  } = props

  const abs = Math.abs(percent)
  const p = round ? abs.toFixed(fixed) : utilParse.noRoundFixed(abs, fixed!)
  const blockClass = ` !text-white rounded px-1 ${
    percent >= 0 ? 'bg-rise' : 'bg-fall'
  } `

  return (
    <span
      className={clsx(
        'inline-flex items-center',
        percent >= 0 ? 'text-rise' : 'text-fall',
        block ? blockClass : '',
        className
      )}
    >
      {percent >= 0 ? riseSymbol : fallSymbol}
      <span>
        {p}
        {showPercent && '%'}
      </span>
    </span>
  )
}

export default PercentTag
