import type { UserPublicDto } from './user.dto'

export interface FollowPageDto {
    users: UserPublicDto[]
    page: number
    total: number
    totalPages: number
}
