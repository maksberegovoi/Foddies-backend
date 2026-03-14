import type { UserProfilePublicDto } from './user.dto'

export interface FollowPageDto {
    users: UserProfilePublicDto[]
    page: number
    total: number
    totalPages: number
}
