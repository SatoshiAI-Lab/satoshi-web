import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { FaTwitter } from 'react-icons/fa'
import { FaTelegramPlane } from 'react-icons/fa'
import { GrLanguage } from 'react-icons/gr'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { IoCopyOutline } from 'react-icons/io5'
import { IconButton, Dialog } from '@mui/material'
import { BiError } from 'react-icons/bi'

import MessageBubble from '../bubbles/message-bubble'
import { utilFmt } from '@/utils/format'
import { useClipboard } from '@/hooks/use-clipboard'
import { link } from '@/config/link'
import { WalletChain } from '@/config/wallet'
import { utilLang } from '@/utils/language'
import { useShow } from '@/hooks/use-show'
import { DialogHeader } from '@/components/dialog-header'
import { MonitorPoolStatus } from '@/config/monitor'

import type { ChatResponseMetaNewPoolV2 } from '@/api/chat/types'
import numeral from 'numeral'

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

const NewPoolBubble = (props: ChatResponseMetaNewPoolV2) => {
  const { t } = useTranslation()
  const { copy } = useClipboard()

  const { show, open, hidden } = useShow()

  // props = data as unknown as ChatResponseMetaNewPoolV2

  const normalList: SecurityList[] = []
  const riskList: SecurityList[] = []
  const unknownList: SecurityList[] = []

  props.security?.content?.forEach((item) => {
    const desc = utilLang.getContent(item.content)
    switch (item.status) {
      case MonitorPoolStatus.normal: {
        normalList.push({ desc, status: t('normal'), icon: <></> })
      }
      case MonitorPoolStatus.risk: {
        riskList.push({
          desc,
          status: <span className="text-red-500">{t('risk')}</span>,
          icon: (
            <span className="text-red-500">
              <BiError />
            </span>
          ),
        })
      }
      case MonitorPoolStatus.unknown: {
        unknownList.push({ desc, status: t('unknown'), icon: <></> })
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
          {normalList.map((item) => {
            return <SecurityItem {...item}></SecurityItem>
          })}
        </div>
      </>
    )
  }

  const handleRiskList = () => {
    if (!riskList.length) {
      return <div className="mt-[6px]">{t('no.contract.risk')}</div>
    }
    return riskList.map((item) => {
      return <SecurityItem {...item}></SecurityItem>
    })
  }

  const handleUnknownList = () => {
    if (!unknownList.length) {
      return <></>
    }
    return unknownList.map((item) => {
      return <SecurityItem {...item}></SecurityItem>
    })
  }

  return (
    <MessageBubble className={clsx('w-bubble pt-4')}>
      {/* Avatar, name */}
      <div className="flex justify-between">
        <div className="flex items-stretch gap-[8px]">
          {/* <img
            src="/images/i1.png"
            alt="avatar"
            className="w-[40px] h-[40px] rounded-full"
          /> */}
          <div className="flex flex-col">
            <span className="font-bold h-[20px] leading-none">
              {t('new-pool').replace('{}', props.chain)}
            </span>
            <span className="text-gray-400 h-[20px] text-sm">
              {dayjs(props.created_at).format('H:mm M/D')}
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
              onClick={() => window.open(props.twitter)}
              title="Twitter"
              color="primary"
              disabled={!props.twitter}
            >
              <FaTwitter size={20} />
            </IconButton>
            <IconButton
              onClick={() => window.open(props.telegram)}
              color="primary"
              title="Telegram"
              disabled={!props.telegram}
            >
              <FaTelegramPlane size={22} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => window.open(props.website)}
              title="Website"
              disabled={!props.website}
            >
              <GrLanguage size={20} />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="my-2 font-bold">
        {props.symbol}({props.name})
      </div>

      <div className="flex items-center mb-2">
        <span className="font-bold">{t('ca')}:</span>{' '}
        <a
          href={`${link.solscan}account/${props.address}`}
          target="_blank"
          className="text-primary ml-1 underline"
        >
          {utilFmt.addr(props.address)}
        </a>
        <IoCopyOutline
          className="ml-3 cursor-pointer"
          onClick={() => copy(props.address)}
        />
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('liquidity')}:</span>
        <span>{numeral(props.liquidity).format('$0,0a.00')}</span>
      </div>
      {props.started ? (
        <div className="flex items-center mb-2">
          <span className="font-bold mr-1">{t('started')}:</span>{' '}
          <span>{numeral(props.started).format('$0,0a.00')}</span>
        </div>
      ) : null}
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('price')}:</span>
        <span>${utilFmt.token(props.price)}</span>
      </div>

      <div className="grid grid-cols-2">
        {!!props.security && (
          <div>
            <div className="font-bold mt-2">⚙️ {t('ca-secutiry')}</div>
            <div className="max-h-[185px] overflow-y-scroll">
              {handleRiskList()}
              <div className="mt-2 text-sm text-gray-500">
                {utilLang.getContent(props.security.remark)}
              </div>
            </div>
          </div>
        )}
        {!!props.top_holders && (
          <div className="ml-4">
            <div className="font-bold mt-2">🏦 {t('top-holders')}</div>
            {Object.keys(props.top_holders).map((key) => (
              <div className="mt-2" key={key}>
                {props.chain == WalletChain.SOL ? key : utilFmt.addr(key)}:{' '}
                {props.chain == WalletChain.SOL
                  ? props.top_holders[key]
                  : `${Number(props.top_holders[key]).toFixed(2)}%`}
              </div>
            ))}
            <div></div>
          </div>
        )}
      </div>
      <div className="my-2">
        <div className="font-bold mt-2">
          🧠 {t('score')}:{' '}
          {props.score.score ?? (
            <span className="text-red-500">{t('hight.risk')}</span>
          )}
        </div>
        {props.score?.detail?.map((item) => (
          <div className="mt-2" key={item}>
            {item}
          </div>
        ))}
      </div>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader text={'list'} onClose={hidden}></DialogHeader>
        <></>
      </Dialog>
    </MessageBubble>
  )
}

export default NewPoolBubble
