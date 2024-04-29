import React from 'react'
import { clsx } from 'clsx'
import { Skeleton } from '@mui/material'

interface Props extends React.ComponentProps<'div'> {
  length?: number
}

export const WalletSkeleton = (props: Props) => {
  const { length = 3, className } = props

  return (
    <div className={clsx(className)}>
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'border border-black rounded-md px-4 py-5 mt-5',
            'flex justify-between relative mb-6 last:mb-0'
          )}
        >
          <div className="flex flex-col">
            <div className="flex">
              <Skeleton variant="rounded" width={100} height={25} />
              <Skeleton
                variant="circular"
                width={28}
                height={28}
                className={clsx('ml-2')}
              />
            </div>
            <Skeleton variant="rounded" width={80} className={clsx('my-1')} />
            <Skeleton variant="rounded" width={110} />
          </div>
          <div className="flex items-center">
            <Skeleton
              variant="rounded"
              width={125}
              height={40}
              className={clsx('!rounded-full')}
            />
            <Skeleton
              variant="rounded"
              width={125}
              height={40}
              className={clsx('mx-4 !rounded-full')}
            />
            <Skeleton
              variant="rounded"
              width={125}
              height={40}
              className={clsx('!rounded-full')}
            />
          </div>
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            className={clsx('absolute right-2 top-4')}
          />
        </div>
      ))}
    </div>
  )
}

export default WalletSkeleton
