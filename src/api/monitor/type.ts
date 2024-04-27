import { MonitorConfig } from '@/config/monitor'

export interface MonitorParam {
  message_type: MonitorConfig
  content: MonitorContent[MonitorConfig]
}

export interface MonitorContent {
  [MonitorConfig.News]: News['content']
  [MonitorConfig.Twitter]: string[]
  [MonitorConfig.Announcement]: string[]
  [MonitorConfig.Trade]: Trade['content']
  [MonitorConfig.Pool]: Pool['content']
}

export interface MonitorConfigData {
  news: News
  twitter: Twitter
  announcement: Announcement
  trade: Trade
  pool: Pool
}

export interface Announcement {
  message_type: number
  content: AnnouncementList[]
}

export interface News {
  message_type: number
  content: {
    switch: Switch
  }
}

export type Switch = 'on' | 'off'

export interface Pool {
  message_type: number
  content: PoolData[]
}

export interface Twitter {
  message_type: number
  content: TwitterList[]
}

export interface Trade {
  message_type: number
  content: AddressData[]
}

export interface AnnouncementList {
  id: number
  slug: string
  name: string
  subscribed: boolean
}

export interface AddressData {
  address: string
  name: string
  chain?: string
}

export interface PoolData {
  id: number
  slug: string
  chain: string
  min: number | null
  max: number | null
  subscribed: boolean
  logo: string
}
export interface TwitterList {
  twitter_id: string
  twitter: string
  name: string
  logo: string
  subscribed: boolean
}

export interface MonitorListData {
  news: MonitorNewsData
  twitter: MonitorTwitterData
  announcement: MonitorAnnouncementData
  trade: MonitorTradeData
  pool: MonitorPoolData
}

export interface MonitorNewsData {
  message_type: 0
  content: {
    switch: string
  }
}

export interface MonitorTwitterData {
  message_type: 1
  content: [
    {
      id: number
      twitter: string
      name: string
      logo: string
      subscribed: boolean
    }
  ]
}

export interface MonitorAnnouncementData {
  message_type: 2
  content: {
    id: number
    slug: string
    name: string
    subscribed: boolean
  }[]
}

export interface MonitorTradeData {
  message_type: 3
  content: string[]
}

export interface MonitorPoolData {
  message_type: 4
  content: {
    name: string
    subscribed: boolean
  }[]
}
