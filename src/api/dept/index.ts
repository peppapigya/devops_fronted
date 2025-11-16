import request from '@/config/axios'
import type { DeptVO, DeptPageParams } from './types'

export const DeptApi = {
  page: async (data: DeptPageParams) => {
    return await request.post({ url: '/sysDept/page', data })
  },
  tree: async () => {
    return await request.get({ url: '/sysDept/tree' })
  },
  detail: async (id: number) => {
    return await request.get({ url: `/sysDept/${id}` })
  },
  create: async (data: DeptVO) => {
    return await request.post({ url: '/sysDept/', data })
  },
  update: async (data: DeptVO) => {
    return await request.put({ url: '/sysDept/', data })
  },
  remove: async (id: number) => {
    return await request.delete({ url: `/sysDept/${id}` })
  },
  updateStatus: async (id: number, status: number) => {
    return await request.put({ url: `/sysDept/${id}/status?status=${status}` })
  }
}