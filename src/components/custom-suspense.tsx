import React from 'react'

interface CustomSuspenseProps extends React.ComponentProps<'div'> {
  container?: keyof React.ReactHTML | 'fragment'
  isPendding?: boolean
  isStale?: boolean
  fallback?: React.ReactNode
  nullback?: React.ReactNode
}

const CustomSuspense = (props: CustomSuspenseProps) => {
  const {
    container = 'fragment',
    children,
    isPendding,
    isStale,
    fallback,
    nullback,
    ...containerProps
  } = props
  const isEmpty = !children || children!.toString().trim() === ''

  if (isPendding) return fallback
  if (isEmpty) return nullback
  if (container === 'fragment') {
    return <>{children}</>
  }

  return React.createElement(
    container,
    {
      style: {
        opacity: isStale ? 0.5 : 1,
        ...containerProps,
      },
    },
    children
  )
}

export default CustomSuspense
