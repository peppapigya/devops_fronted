import request from '@/config/axios'

// 文件信息接口
export interface FileInfo {
    name: string
    size: number
    type: string
    uid: number
}

// 分发结果
export interface DistributeResult {
    hostId: number
    hostAddr: string
    fileName: string
    success: boolean
    message?: string
}

export const DistributeApi = {
    // 分发文件到目标服务器 (支持文件上传)
    distributeFiles: async (data: FormData) => {
        return await request.post<DistributeResult[]>({
            url: '/jobs/distribute/upload',
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    // 获取分发历史
    getDistributeHistory: async (params?: { pageNum?: number; pageSize?: number }) => {
        return await request.get({ url: '/jobs/distribute/history', params })
    },

    // 验证目标路径
    validatePath: async (data: { hostIds: number[]; path: string }) => {
        return await request.post({ url: '/jobs/distribute/validate-path', data })
    }
}
