import { type Request, type Response } from 'express'
import UserService from './user.service'

import type { UserPublicDto } from './dto/user.dto'
import type { FollowPageDto } from './dto/follow-page.dto'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import { paginationQuery } from './schemas/pagination-query.schema'

class UserController {
    constructor(private readonly userService: UserService) {}

    current = async (
        req: Request,
        res: Response<ApiResponse<UserPublicDto>>
    ) => {
        const user = await this.userService.current({
            userId: req.user?.id
        })

        res.json({ data: user })
    }

    followers = async (
        req: Request,
        res: Response<ApiResponse<FollowPageDto>>
    ) => {
        const { page, limit } = paginationQuery.parse(req.query)

        const result = await this.userService.followers({
            userId: req.user?.id,
            page,
            limit
        })

        res.json({ data: result })
    }

    following = async (
        req: Request,
        res: Response<ApiResponse<FollowPageDto>>
    ) => {
        const { page, limit } = paginationQuery.parse(req.query)

        const result = await this.userService.following({
            userId: req.user?.id,
            page,
            limit
        })

        res.json({ data: result })
    }

    follow = async (req: Request, res: Response<ApiResponse<void>>) => {
        const userId = req.user?.id
        const targetUserId = req.body['targetUserId'] as string
        await this.userService.follow({ userId, targetUserId })

        res.status(204).json()
    }

    unfollow = async (req: Request, res: Response<ApiResponse<void>>) => {
        const userId = req.user?.id
        const targetUserId = req.body['targetUserId'] as string
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
            userId: req.user?.id
        })

        res.json({ data: { avatarUrl } })
    }
}

export const userController = new UserController(new UserService())
