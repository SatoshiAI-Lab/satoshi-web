import React from 'react'
import clsx from 'clsx'
import { FaTwitter } from 'react-icons/fa'
import { FaTelegramPlane } from 'react-icons/fa'
import { GrLanguage } from 'react-icons/gr'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { IoCopyOutline } from 'react-icons/io5'
import { Dialog, IconButton } from '@mui/material'

import MessageBubble from '../bubbles/message-bubble'
import { utilFmt } from '@/utils/format'
import { useClipboard } from '@/hooks/use-clipboard'
import {
  ChatResponseMetaNewPool,
  ChatResponseMetaNewPoolV2,
  SecurityContent,
} from '@/api/chat/types'
import { link } from '@/config/link'
import { WalletChain } from '@/config/wallet'
import { utilLang } from '@/utils/language'
import { MonitorPoolStatus } from '@/config/monitor'
import { BiError } from 'react-icons/bi'
import { DialogHeader } from '@/components/dialog-header'
import { useShow } from '@/hooks/use-show'

const data = {
  id: 'd7cb3851-1d54-4f71-8b8d-eb5f8decfc0e',
  chain: 'Optimism',
  address: '0xc418b123885d732ed042b16e12e259741863f723',
  name: 'DBXen Token on Optimism', //全称
  symbol: 'opDXN', //简称
  liquidity: 15.8225, //流动性
  price: 3506.5900170056475, //基于美元的价格
  started: '2024-04-11T19:01:15Z', //发币时间
  twitter: '', //twitter_url
  telegram: '', //telegram_url
  website: '', //官网url
  security: {
    content: [
      {
        status: 0, //status：0 安全  1 危险  2 未知
        content: {
          en: 'is_open_source',
          zh: '合约未开源',
        },
        type: 'is_open_source',
      },
      {
        status: 0,
        content: {
          en: 'can_take_back_ownership',
          zh: '可取回所有权',
        },
        type: 'can_take_back_ownership',
      },
      {
        status: 0,
        content: {
          en: 'anti_whale_modifiable',
          zh: '防巨鲸可改',
        },
        type: 'anti_whale_modifiable',
      },
      {
        status: 0,
        content: {
          en: 'cannot_buy',
          zh: '不可买入',
        },
        type: 'cannot_buy',
      },
      {
        status: 2,
        content: {
          en: 'cannot_sell_all',
          zh: '不可一次性卖出',
        },
        type: 'cannot_sell_all',
      },
      {
        status: 0,
        content: {
          en: 'external_call',
          zh: '有外部合约调用风险',
        },
        type: 'external_call',
      },
      {
        status: 0,
        content: {
          en: 'hidden_owner',
          zh: '有隐藏的owner',
        },
        type: 'hidden_owner',
      },
      {
        status: 0,
        content: {
          en: 'is_blacklisted',
          zh: '包含黑名单机制',
        },
        type: 'is_blacklisted',
      },
      {
        status: 0,
        content: {
          en: 'is_honeypot',
          zh: '是貔貅代币',
        },
        type: 'is_honeypot',
      },
      {
        status: 1,
        content: {
          en: 'is_mintable',
          zh: '可增发',
        },
        type: 'is_mintable',
      },
      {
        status: 1,
        content: {
          en: 'is_open_source',
          zh: '合约未开源',
        },
        type: 'is_open_source',
      },
      {
        status: 0,
        content: {
          en: 'is_proxy',
          zh: '是代理合约',
        },
        type: 'is_proxy',
      },
      {
        status: 0,
        content: {
          en: 'is_whitelisted',
          zh: '包含白名单机制',
        },
        type: 'is_whitelisted',
      },
      {
        status: 0,
        content: {
          en: 'owner_change_balance',
          zh: 'Owner可修改余额',
        },
        type: 'owner_change_balance',
      },
      {
        status: 0,
        content: {
          en: 'personal_slippage_modifiable',
          zh: '可针对特定地址改 税',
        },
        type: 'personal_slippage_modifiable',
      },
      {
        status: 0,
        content: {
          en: 'selfdestruct',
          zh: '该代币能自毁',
        },
        type: 'selfdestruct',
      },
      {
        status: 0,
        content: {
          en: 'slippage_modifiable',
          zh: '交易税可改',
        },
        type: 'slippage_modifiable',
      },
      {
        status: 0,
        content: {
          en: 'trading_cooldown',
          zh: '有交易冷却功能',
        },
        type: 'trading_cooldown',
      },
      {
        status: 0,
        content: {
          en: 'transfer_pausable',
          zh: '有暂停交易功能',
        },
        type: 'transfer_pausable',
      },
      {
        status: 2,
        content: {
          en: 'is_locked',
          zh: '未锁池子',
        },
        type: 'lp_holders',
      },
    ],
    remark: {
      en: 'Remark: Contract testing is for reference only',
      zh: '合约检测仅供参考',
    },
  },
  top_holders: {
    '0x2a9c55b6dc56da178f9f9a566f1161237b73ba66': '0.898736796729459198',
    '0xe7db3c1f57961a9f3e5ce067b7c54c865d63f847': '0.019229826949129883',
    '0x06ab6666ab2bb2e5d6979c23635894250b38cd6c': '0.018664048086904543',
    '0xda4b42e0d28d395e6375f011f00507b0aeff7d10': '0.018073439427688436',
    '0x043be2bd868e9bc50b175140464156dcb23d23aa': '0.006099245981523113',
  }, //持有者地址，以及持有占比
  score: {
    score: 50.030642201834866,
  }, //代币评分
  created_at: '2024-04-12T16:13:55.444839',
  data_type: 'pool_info',
}
interface SecurityList {
  desc: string
  status: string
  icon: React.ReactElement
}

const SecurityItem = ({ desc, status, icon }: SecurityList) => {
  return (
    <div className="flex items-center">
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

  props.security?.content.forEach((item) => {
    const desc = utilLang.getContent(item.content)
    switch (item.status) {
      case MonitorPoolStatus.normal: {
        normalList.push({ desc, status: t('normal'), icon: <></> })
      }
      case MonitorPoolStatus.risk: {
        riskList.push({ desc, status: t('risk'), icon: <BiError /> })
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
            item.status
            return <SecurityItem {...item}></SecurityItem>
          })}
        </div>
      </>
    )
  }

  const handleRiskList = () => {
    if (!riskList.length) {
      return <></>
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
              {t('new-pool').replace('{}', 'Solana')}
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
        <span>${props.liquidity}</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('started')}:</span>{' '}
        <span>${props.started}</span>
      </div>
      <div className="flex items-center mb-2">
        <span className="font-bold mr-1">{t('price')}:</span>
        <span>${props.price}</span>
      </div>

      <div className="grid grid-cols-2">
        {!!props.security && (
          <div>
            <div className="font-bold mt-2">⚙️ {t('ca-secutiry')}</div>
            <div className="max-h-[205px] overflow-y-scroll">
              {handleRiskList()}
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
        {!!props.score?.score && (
          <div className="my-2">
            <div className="font-bold mt-2">
              🧠 {t('score')}: {props.score.score}
            </div>
            {props.score?.detail?.map((item) => (
              <div className="mt-2" key={item}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={show} onClose={hidden}>
        <DialogHeader text={'list'} onClose={hidden}></DialogHeader>
        <></>
      </Dialog>
    </MessageBubble>
  )
}

export default NewPoolBubble
