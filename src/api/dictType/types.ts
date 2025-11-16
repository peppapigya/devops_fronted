export interface DictTypeVO {
  id?: number
  name: string
  type: string
  status?: number
  remark?: string
  creator?: string
  createAt?: string
  updater?: string
  updateAt?: string
  deletedAt?: string | null
}

export interface DictTypePageParams {
  pageNum: number
  pageSize: number
  name?: string
  type?: string
  status?: number | ''
}