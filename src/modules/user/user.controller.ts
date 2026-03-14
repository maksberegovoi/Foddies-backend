import { type Request, type Response } from 'express'
import UserService from './user.service'
import type { UserProfileDto, UserProfilePublicDto } from './dto/user.dto'
import type { ApiResponse } from '../../shared/http/types/api-response.type'
import { paginationQuery } from './schemas/pagination-query.schema'
import { idParamSchema } from '../../shared/http/schemas/idParam.schema'
import type { ApiResponsePaginated } from '../../shared/http/types/api-response-paginated.type'

class UserController {
    constructor(private readonly userService: UserService) {}

    current = async (
        req: Request,
        res: Response<ApiResponse<UserProfileDto>>
    ) => {
        const user = await this.userService.current({
            userId: req.user?.id
        })

        res.json({ data: user })
    }

    getUserById = async (
        req: Request,
        res: Response<ApiResponse<UserProfilePublicDto>>
    ) => {
        const userId = req.user.id
        const user = await this.userService.getUserById({ userId })

        res.json({ data: user })
    }

    followers = async (
        req: Request,
        res: Response<ApiResponsePaginated<UserProfilePublicDto>>
    ) => {
        const query = paginationQuery.parse(req.query)
        const { id: userId } = idParamSchema.parse(req.params)
        const { items: data, ...meta } = await this.userService.followers(
            query,
            userId
        )

        res.json({ data, meta })
    }

    following = async (
        req: Request,
        res: Response<ApiResponsePaginated<UserProfilePublicDto>>
    ) => {
        const query = paginationQuery.parse(req.query)
        const { id: userId } = idParamSchema.parse(req.params)

        const { items: data, ...meta } = await this.userService.following(
            query,
            userId
        )

        res.json({ data, meta })
    }

    follow = async (req: Request, res: Response<ApiResponse<void>>) => {
        const userId = req.user.id
        const { id: targetUserId } = idParamSchema.parse(req.params)
        await this.userService.follow({ userId, targetUserId })

        res.status(204).json()
    }

    unfollow = async (req: Request, res: Response<ApiResponse<void>>) => {
        const userId = req.user.id
        const { id: targetUserId } = idParamSchema.parse(req.params)
        await this.userService.unfollow({ userId, targetUserId })

        res.status(204).json()
    }

    updateAvatar = async (
        req: Request,
        res: Response<ApiResponse<{ avatarUrl: string }>>
    ) => {
        const file = req.file

        const avatarUrl = await this.userService.uploadAvatar({
            file,
            userId: req.user.id
        })

        res.json({ data: { avatarUrl } })
    }
}

export const userController = new UserController(new UserService())
