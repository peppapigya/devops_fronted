// Host 及请求载荷类型，风格与登录模块保持一致
export interface Host {
  id: number
  hostName: string
  address: string
  hostPort: number
  username: string
  hostPassword?: string
  remark?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateHostDTO {
  hostName: string
  address: string
  hostPort: number
  username: string
  hostPassword?: string
  remark?: string
}

export interface PageParamDTO {
    pageSize: number
    pageNumber: number
    keyword?: string
}

export type UpdateHostDTO = CreateHostDTO

// 巡检返回结构可能较灵活，这里使用 any；如需约束可让我按后端返回细化
export type InspectResult = any
