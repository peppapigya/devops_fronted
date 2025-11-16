import request from '@/config/axios'
import type { DictTypeVO, DictTypePageParams } from './types'

export const DictTypeApi = {
  page: async (data: DictTypePageParams) => request.post({ url: '/sysDictType/page', data }),
  detail: async (id: number) => request.get({ url: `/sysDictType/${id}` }),
  create: async (data: DictTypeVO) => request.post({ url: '/sysDictType/', data }),
  update: async (data: DictTypeVO) => request.put({ url: '/sysDictType/', data }),
  remove: async (id: number) => request.delete({ url: `/sysDictType/${id}` }),
  updateStatus: async (id: number, status: number) => request.put({ url: `/sysDictType/${id}/status?status=${status}` })
}