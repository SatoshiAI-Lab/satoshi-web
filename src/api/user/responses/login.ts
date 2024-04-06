export interface LoginRes {
  refresh?: string
  access?: string
}

export interface User {
  id?: number
  username?: string
  mobile?: string
  email?: string
  avatar?: string
  intro?: string
  address?: string
  code?: string
  ids: IDElement[]
  vip?: Vip
  latest_cipher_id?: number
  latest_cipher_signal_id?: number
}

export interface IDElement {
  id: number
  type: number
}

export interface Vip {
  end_at?: number
  status?: number
}
