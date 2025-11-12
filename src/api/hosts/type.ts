// Host 及请求载荷类型，风格与登录模块保持一致
export interface Host {
  id: number
  name: string
  address: string
  port: number
  username: string
  password?: string
  remark?: string
  created_at?: string
  updated_at?: string
}

export interface CreateHostDTO {
  name: string
  address: string
  port: number
  username: string
  password?: string
  remark?: string
}

export type UpdateHostDTO = CreateHostDTO

// 巡检返回结构可能较灵活，这里使用 any；如需约束可让我按后端返回细化
export type InspectResult = any