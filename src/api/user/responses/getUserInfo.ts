export interface UserInfoRes {
  email?: string
}

export interface UserInfoIds {
  list: IDElement[]
}

export interface IDElement {
  id: number
  type: number
}

export interface Vip {
  end_at?: number
  status?: number
}
