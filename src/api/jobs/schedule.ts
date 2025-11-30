import request from '@/config/axios'

export interface JobScheduledTask {
    id?: number
    name: string
    planId: number
    strategy: string // cron expression
    leatestStatus?: number // 0: success, 1: fail, etc.
    sycleSuccessRate?: number
    status: number // 0: disable, 1: enable
    created_at?: string
    updated_at?: string
}

export interface JobSchedulePageReq {
    pageNum: number
    pageSize: number
    name?: string
    status?: number
}

export const ScheduleApi = {
    // Get schedule page
    getSchedulePage: async (params: JobSchedulePageReq) => {
        return await request.get({ url: '/jobs/schedule/page', params })
    },
    // Get schedule detail
    getSchedule: async (id: number) => {
        return await request.get({ url: `/jobs/schedule/${id}` })
    },
    // Add schedule
    addSchedule: async (data: JobScheduledTask) => {
        return await request.post({ url: '/jobs/schedule', data })
    },
    // Update schedule
    updateSchedule: async (data: JobScheduledTask) => {
        return await request.put({ url: '/jobs/schedule', data })
    },
    // Delete schedule
    deleteSchedule: async (id: number) => {
        return await request.delete({ url: `/jobs/schedule/${id}` })
    },
    // Update status
    updateStatus: async (id: number, status: number) => {
        return await request.put({ url: `/jobs/schedule/${id}/status`, data: { status } })
    }
}
