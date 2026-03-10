import { type Request, type Response } from 'express'
import UserService from './user.service'
import { createUserSchema } from './schemas/create-user.schema'
import type { UserDto } from './dto/user.dto'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'

class UserController {
    constructor(private readonly userService: UserService) {}
    create = async (req: Request, res: Response<ApiResponse<UserDto>>) => {
        const createUserDto = createUserSchema.parse(req.body)

        const user = await this.userService.create(createUserDto)

        res.json({ data: user })
    }
}

export const userController = new UserController(new UserService())
