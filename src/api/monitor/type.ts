export interface MonitorParam {
  message_type: 0 | 1 | 2 | 3 | 4
  content: any
}

export interface MonitorData {
  id: number
  user: string
  message_type: number
  content: Content
  update_time: Date
  create_time: Date
}

export interface Content {
  news: News
}

export interface News {
  switch: string
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

export interface AnnouncementList {
  id: number
  slug: string
  name: string
  subscribed: boolean
}

export interface Trade {
  content: string[]
}

export interface News {
  message_type: number
  content: NewsList
}

export interface NewsList {
  switch: string
}

export interface Pool {
  message_type: number
  content: PoolList[]
}

export interface PoolList {
  name: string
  subscribed: boolean
}

export interface Twitter {
  message_type: number
  content: TwitterList[]
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
    switch: string // on:开启，off:关闭
  }
}

export interface MonitorTwitterData {
  message_type: 1
  content: [
    {
      id: number // 推特 id
      twitter: string // 推特用户名
      name: string // 推特显示名
      logo: string // 头像
      subscribed: boolean // 是否已订阅
    }
  ]
}

export interface MonitorAnnouncementData {
  message_type: 2
  content: [
    {
      id: number // 交易所 id
      slug: string // 交易所标注
      name: string // 交易所名
      subscribed: boolean // 是否已订阅
    }
  ]
}

export interface MonitorTradeData {
  message_type: 3
  content: string[] // 监控的目标地址
}

export interface MonitorPoolData {
  message_type: 4
  content: [
    {
      name: string // 网络名
      subscribed: boolean // 是否已订阅
    }
  ]
}
