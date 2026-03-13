import { type Request, type Response } from 'express'
import UserService from './user.service'

import type { UserDto } from './dto/user.dto'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'

class UserController {
    constructor(private readonly userService: UserService) {}

    current = async (req: Request, res: Response<ApiResponse<UserDto>>) => {
        const user = await this.userService.current({
            userId: req.params['id'] as string //TODO: change it to read user from token
        })

        res.json({ data: user })
    }

    followers = async (req: Request, res: Response<ApiResponse<UserDto[]>>) => {
        const followers = await this.userService.followers({
            userId: req.params['id'] as string //TODO: change it to read user from token
        })

        res.json({ data: followers })
    }

    following = async (req: Request, res: Response<ApiResponse<UserDto[]>>) => {
        const following = await this.userService.following({
            userId: req.params['id'] as string //TODO: change it to read user from token
        })

        res.json({ data: following })
    }

    follow = async (req: Request, res: Response<ApiResponse<void>>) => {
        const userId = req.params['id'] as string //TODO: change it to read user from token
        const targetUserId = req.body['targetUserId'] as string
        await this.userService.follow({ userId, targetUserId })

        res.status(204).json()
    }

    unfollow = async (req: Request, res: Response<ApiResponse<void>>) => {
        const userId = req.params['id'] as string //TODO: change it to read user from token
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
            userId: 'cmml4cxy800000ggk96ahou6v'
        })

        res.json({ data: { avatarUrl } })
    }
}

export const userController = new UserController(new UserService())
