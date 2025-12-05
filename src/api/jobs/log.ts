import request from '@/config/axios'

export interface JobPlanLog {
    id?: number
    planId: number
    hostId: number
    method: string
    type: string
    status: number // 0: running, 1: success, 2: fail
    totalTime: number
    returnCode: number
    output: string
    createdAt?: string
    updatedAt?: string
}

export interface JobLogPageReq {
    pageNum: number
    pageSize: number
    planId?: number
    hostId?: number
    status?: number
}

export const LogApi = {
    // Get log page
    getLogPage: async (data: JobLogPageReq) => {
        return await request.post({ url: '/jobs/log/page', data: data })
    },
    // Get log detail
    getLog: async (id: number) => {
        return await request.get({ url: `/jobs/log/${id}` })
    }
}
