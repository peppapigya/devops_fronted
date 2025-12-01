import request from '@/config/axios'

export interface JobScript {
    id?: number
    name: string
    type: string
    category: string
    content: string
    parameters?: string
    timeout?: number
    workDir?: string
    env?: string
    createdAt?: string
    updatedAt?: string
}

export interface JobScriptPageReq {
    pageNum: number
    pageSize: number
    name?: string
    type?: string
    category?: string
}

export interface LogItem {
    hostAddr: string
    status: 'pending' | 'running' | 'success' | 'failed'
    output: string
    time: string
    commands?: CommandResult[]  // 存储每个命令的执行结果
}

export interface CommandResult {
    Success: boolean
    Output: string
    Error: string | null
    Host: string
    Command: string
    ExitCode: number
    Duration: string
}

export const ScriptApi = {
    // Get script page
    getScriptPage: async (params: JobScriptPageReq) => {
        return await request.post({ url: '/jobs/script/page', params })
    },
    // Get script detail
    getScript: async (id: number) => {
        return await request.get({ url: `/jobs/script/${id}` })
    },
    // Add script
    addScript: async (data: JobScript) => {
        return await request.post({ url: '/jobs/script/', data })
    },
    // Update script
    updateScript: async (data: JobScript) => {
        return await request.put({ url: '/jobs/script/', data })
    },
    // Delete script
    deleteScript: async (id: number) => {
        return await request.delete({ url: `/jobs/script/${id}` })
    },
    // Get all scripts (for selection)
    getAllScripts: async (params?: { name?: string }) => {
        return await request.get({ url: '/jobs/script/select', params })
    },
    // Execute script
    executeScript: async (data: ExecuteScriptReq) => {
        return await request.post({ url: '/jobs/script/execute', data })
    }
}

export interface ExecuteScriptReq {
    scriptId: number
    hostIds: number[]
    parameters?: string
    timeout?: number
    workDir?: string
    env?: string
    user?: string
}
