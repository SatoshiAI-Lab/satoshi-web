import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { FaTwitter } from 'react-icons/fa'
import { FaTelegramPlane } from 'react-icons/fa'
import { GrLanguage } from 'react-icons/gr'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { IconButton, Dialog } from '@mui/material'
import { BiError } from 'react-icons/bi'
import numeral from 'numeral'

import { MessageBubble } from '../message-bubble'
import { utilFmt } from '@/utils/format'
import { Chain } from '@/config/wallet'
import { utilLang } from '@/utils/language'
import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '@/components/dialog-header'
import { MonitorPoolStatus } from '@/config/monitor'
import { useMessagesContext } from '@/contexts/messages'
import { CopyAddr } from '@/components/copy-addr'

interface SecurityList {
  desc: string
  status: ReactNode
  icon: ReactNode
}

const SecurityItem = ({ desc, status, icon }: SecurityList) => {
  return (
    <div className="flex items-center mt-2">
      {desc}: {status} {icon}
    </div>
  )
}

export const NewPoolBubble = () => {
  const { message } = useMessagesContext()
  const {
    security,
    chain,
    created_at,
    twitter,
    telegram,
    website,
    address,
    liquidity,
    started,
    price,
    top_holders,
    score,
    name,
    symbol,
    outside_url,
  } = message.meta ?? {}
  const { t } = useTranslation()
  const { show, open, hidden } = useShow()

  const normalList: SecurityList[] = []
  const riskList: SecurityList[] = []
  const unknownList: SecurityList[] = []

  security?.content?.forEach((item) => {
    const desc = utilLang.getContent(item.content)

    switch (item.status) {
      case MonitorPoolStatus.Normal: {
        normalList.push({ desc, status: t('normal'), icon: <></> })
        break
      }
      case MonitorPoolStatus.Risk: {
        riskList.push({
          desc,
          status: <span className="text-red-500 ml-1">{t('risk')}</span>,
          icon: (
            <span className="text-red-500">
              <BiError />
            </span>
          ),
        })
        break
      }
      case MonitorPoolStatus.Unknown: {
        unknownList.push({ desc, status: t('unknown'), icon: <></> })
        break
      }
    }
  })

  const handleNormalList = () => {
    if (!normalList.length) {
      return <></>
    }
    return (
      <>
        <div className="">
          {normalList.map((item, i) => (
            <SecurityItem key={i} {...item} />
          ))}
        </div>
      </>
    )
  }

  const handleRiskList = () => {
    if (!riskList.length) {
      return <div className="mt-[6px]">{t('no.contract.risk')}</div>
    }
    return riskList.map((item, i) => <SecurityItem key={i} {...item} />)
  }

  const handleUnknownList = () => {
    if (!unknownList.length) {
      return <></>
    }
    return unknownList.map((item, i) => <SecurityItem key={i} {...item} />)
  }

  return (
    <MessageBubble className={clsx('w-bubble pt-4')}>
      {/* Avatar, name */}
      <div className="flex justify-between">
        <div className="flex items-stretch gap-[8px]">
          {/* <img
            src={}
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full"
          /> */}
          <div className="flex flex-col">
            <span className="font-bold h-[20px] leading-none">
              {t('new-pool').replace('{}', chain ?? '')}
            </span>
            <span className="text-gray-400 h-[20px] text-sm">
              {dayjs(created_at).format('H:mm M/D')}
            </span>
          </div>
        </div>
        {/* <img
          src="/images/i2.png"
          alt="img"
          className="rounded-md w-[44px] h-[44px] border border-gray-300"
        /> */}
        <div className="font-bold -mt-4 mb-1 flex justify-between items-center">
          <div className="flex items-center">
            <IconButton
              onClick={() => window.open(twitter)}
              title="Twitter"
              color="primary"
              disabled={!twitter}
            >
              <FaTwitter size={20} />
            </IconButton>
            <IconButton
              onClick={() => window.open(telegram)}
              color="primary"
              title="Telegram"
              disabled={!telegram}
            >
              <FaTelegramPlane size={22} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => window.open(website)}
              title="Website"
              disabled={!website}
            >
              <GrLanguage size={20} />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="my-2 font-bold">
        {symbol ?? ''}({name})
      </div>
      <CopyAddr
        addr={address}
        className="underline text-primary cursor-pointer"
        containerClass="mb-1"
        onClick={() => window.open(outside_url)}
        iconSize={16}
        prefix={<span className="font-bold mr-1">{t('ca')}:</span>}
      />
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('liquidity')}:</span>
        <span>{numeral(liquidity).format('$0,0a.00')}</span>
      </div>
      {started ? (
        <div className="flex items-center mb-2">
          <span className="font-bold mr-1">{t('started')}:</span>{' '}
          <span>{started}</span>
        </div>
      ) : null}
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('price')}:</span>
        <span>${utilFmt.token(price)}</span>
      </div>

      <div className="grid grid-cols-2">
        {!!security && (
          <div>
            <div className="font-bold mt-2">⚙️ {t('ca-secutiry')}</div>
            <div className="max-h-[185px] overflow-y-scroll">
              {handleRiskList()}
              <div className="mt-2 text-sm text-gray-500">
                {utilLang.getContent(security.remark)}
              </div>
            </div>
          </div>
        )}
        {!!top_holders && (
          <div className="ml-4">
            <div className="font-bold mt-2">🏦 {t('top-holders')}</div>
            {Object.keys(top_holders).map((key) => (
              <div className="mt-2" key={key}>
                {chain == Chain.Sol ? key : utilFmt.addr(key)}:{' '}
                {chain == Chain.Sol
                  ? `${`${parseFloat(top_holders[key])}%` || top_holders[key]}`
                  : `${Number(top_holders[key]).toFixed(2)}%`}
              </div>
            ))}
            <div></div>
          </div>
        )}
        <div className="my-2">
          <div className="font-bold mt-2">
            🧠 {t('score')}:{' '}
            {score?.score ?? (
              <span className="text-red-500">{t('hight.risk')}</span>
            )}
          </div>
          {score?.detail?.map((str, i) => (
            <div className="mt-2" key={i}>
              {str}
            </div>
          ))}
        </div>
      </div>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader text={'list'} onClose={hidden} />
      </Dialog>
    </MessageBubble>
  )
}

export default NewPoolBubble
