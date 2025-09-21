export interface User {
    ID: number
    username: string
    displayName: string
    email: string | null
    phone: string | null
    password: string
    status: number
    CreatedAt: string
    UpdatedAt: string
    DeletedAt: string | null
}

export interface UserQueryParams {
    userName?: string
    status?: string
    pageNum: number
    pageSize: number
}

export interface CreateUserRequest {
    username: string
    displayName: string
    email?: string
    phone?: string
    password: string
    status: number
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
    id: number
}
