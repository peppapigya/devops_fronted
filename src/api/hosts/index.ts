import request from '@/config/axios'
import type { CreateHostDTO, PageParamDTO, UpdateHostDTO } from './type'

// 与 LoginApi 相同风格：返回已解析的数据
export const HostsApi = {
  // 列表
  list: async (data : PageParamDTO) => {
    return await request.post({ url: '/hosts/page',data })
  },
  // 新增
  create: async (data: CreateHostDTO) => {
    return await request.post({ url: '/hosts/', data })
  },
  // 更新
  update: async ( data: UpdateHostDTO) => {
    return await request.put({ url: `/hosts/`, data })
  },
  // 删除
  remove: async (id: number) => {
    return await request.delete({ url: `/hosts/${id}` })
  },
  // 测试连接（后端返回文本）
  test: async (id: number) => {
    return await request.post({ url: `/hosts/${id}/test` })
  },
  // 巡检（后端返回 JSON）
  inspect: async (id: number) => {
    return await request.post({ url: `/hosts/${id}/inspect` })
  }
}