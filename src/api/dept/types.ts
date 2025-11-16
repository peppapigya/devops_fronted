export interface DeptVO {
  id?: number
  name: string
  parentId?: number | null
  sort?: number
  leaderUserId?: number | null
  phone?: string | null
  email?: string | null
  status?: number
  creator?: string
  createAt?: string
  updater?: string
  updateAt?: string
  deletedAt?: string | null
}

export interface DeptPageParams {
  pageNum: number
  pageSize: number
  name?: string
  status?: number | ''
}