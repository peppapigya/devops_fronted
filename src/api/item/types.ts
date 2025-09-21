export interface PageParams {
    pageNum: number
    pageSize: number
    name: string
}

export interface AssistProject {
    id?: number | undefined
    name?: string | undefined
    budget?: string | undefined
    state?: number | undefined
    implementationPlan?: string | undefined
    createTime?: string | undefined
    createBy?: string | undefined
    approveTime?: string | undefined
    approver?: string | undefined
    acceptor?: string | undefined
}

export interface AssistProjectVO {
    id?: number | undefined
    name?: string | undefined
    budget?: string | undefined
    state?: number | undefined
    implementationPlan?: string | undefined,
    userId?: string | undefined
}

export interface AssistProjectRecordVO {
    pageNum: number | undefined
    pageSize: number | undefined
    total: number | undefined
    rows: AssistProjectRecordVO[];
}