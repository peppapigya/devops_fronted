import { service } from '@/config/axios/service'

export type MenuRoute = {
  id?: number
  name: string
  path: string
  component?: string
  componentName?: string
  icon?: string
  permission?: string
  visible?: boolean
  keepAlive?: boolean
  alwaysShow?: boolean
  children?: MenuRoute[]
}

// 菜单管理相关的类型定义
export interface MenuCreateDTO {
  name: string
  permission: string
  type: number // 1:目录 2:菜单 3:按钮
  sort: number
  parent_id: number
  path?: string
  icon?: string
  component?: string
  component_name?: string
  visible: boolean
  keep_alive: boolean
  always_show: boolean
}

export interface MenuUpdateDTO extends MenuCreateDTO {
  id: number
  status: number
}

export interface MenuQueryDTO {
  name?: string
  type?: number
  status?: number
  parent_id?: number
  page?: number
  page_size?: number
}

export interface MenuListVO {
  id: number
  name: string
  permission: string
  type: number
  sort: number
  parent_id: number
  path?: string
  icon?: string
  component?: string
  component_name?: string
  status: number
  visible: boolean
  keep_alive: boolean
  always_show: boolean
  creator?: string
  create_at: string
  updater?: string
  update_at: string
  children?: MenuListVO[]
}

export interface MenuTreeVO {
  id: number
  name: string
  label: string
  parent_id: number
  children?: MenuTreeVO[]
}

export interface MenuOptionVO {
  value: number
  label: string
}

export interface PageResult<T> {
  total: number
  list: T[]
}

export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export const MenuApi = {
  // 获取路由信息（原有的方法）
  getRoutes: (): Promise<ApiResponse<MenuRoute[]>> => service.get('/sysMenu/routes'),
  
  // 菜单CRUD操作
  create: (data: MenuCreateDTO): Promise<ApiResponse> => service.post('/sysMenu', data),
  
  update: (id: number, data: MenuUpdateDTO): Promise<ApiResponse> => service.put(`/sysMenu/${id}`, data),
  
  delete: (id: number): Promise<ApiResponse> => service.delete(`/sysMenu/${id}`),
  
  // 查询操作
  getList: (params?: MenuQueryDTO): Promise<ApiResponse<PageResult<MenuListVO>>> => 
    service.get('/sysMenu/list', { params }),
  
  getTree: (): Promise<ApiResponse<MenuTreeVO[]>> => service.get('/sysMenu/tree'),
  
  getOptions: (): Promise<ApiResponse<MenuOptionVO[]>> => service.get('/sysMenu/options'),
  
  getById: (id: number): Promise<ApiResponse<MenuListVO>> => service.get(`/sysMenu/${id}`)
}