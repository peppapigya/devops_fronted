import request from '@/config/axios'

export interface JobPlanScript {
    id?: number
    planId?: number
    scriptId: number
    sort: number
    scriptName?: string // Optional, for display
}

export interface JobPlan {
    id?: number
    name: string
    globalVars?: string
    hostIds?: number[]
    hostGroupId?: number
    remark?: string
    createdAt?: string
    updatedAt?: string
    scripts?: JobPlanScript[]
}

export interface JobPlanPageReq {
    pageNum: number
    pageSize: number
    name?: string
}

export const PlanApi = {
    // Get plan page
    getPlanPage: async (params: JobPlanPageReq) => {
        return await request.get({ url: '/jobs/plan/page', params })
    },
    // Get plan detail
    getPlan: async (id: number) => {
        return await request.get({ url: `/jobs/plan/${id}` })
    },
    // Add plan
    addPlan: async (data: JobPlan) => {
        return await request.post({ url: '/jobs/plan', data })
    },
    // Update plan
    updatePlan: async (data: JobPlan) => {
        return await request.put({ url: '/jobs/plan', data })
    },
    // Delete plan
    deletePlan: async (id: number) => {
        return await request.delete({ url: `/jobs/plan/${id}` })
    },
    // Get all plans (for selection)
    getAllPlans: async () => {
        return await request.get({ url: '/jobs/plan/list' })
    }
}
