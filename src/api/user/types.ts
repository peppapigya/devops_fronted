export interface User {
    ID: number
    username: string
    password?: string
    nickname: string
    remark?: string
    dept_id?: number
    dept_name?: string // For display purposes
    post_ids?: number[]
    post_names?: string[] // For display purposes
    email: string | null
    mobile: string | null
    sex: number // 0: unknown, 1: male, 2: female
    avatar?: string
    status: number
    login_ip?: string
    login_date?: string
    creator?: string
    create_at?: string
    CreatedAt: string
    UpdatedAt: string
    DeletedAt: string | null
    // Legacy fields for compatibility
    displayName?: string
    phone?: string
}

export interface UserQueryParams {
    userName?: string
    nickname?: string
    dept_id?: number
    status?: string
    sex?: number
    pageNum: number
    pageSize: number
}

export interface CreateUserRequest {
    username: string
    password: string
    nickname: string
    remark?: string
    dept_id?: number
    post_ids?: number[]
    email?: string
    mobile?: string
    sex: number
    avatar?: string
    status: number
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
    id: number
}

// Department option for dropdown
export interface DeptOption {
    id: number
    name: string
    parent_id?: number
    children?: DeptOption[]
}

// Post/Position option for dropdown
export interface PostOption {
    id: number
    name: string
    code?: string
}
