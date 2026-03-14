import type { Request, Response } from 'express'
import AuthService from './auth.service'
import { signUpSchema } from './schemas/sign-up.schema'
import { signInSchema } from './schemas/sign-in.schema'
import UserService from '../user/user.service'
import type { ApiResponse } from '../../shared/http/types/api-response.type'
import type { UserDto } from '../user/dto/user.dto'

class AuthController {
    constructor(private readonly authService: AuthService) {}

    signUp = async (req: Request, res: Response<ApiResponse<UserDto>>) => {
        const signUpDto = signUpSchema.parse(req.body)
        const user = await this.authService.signUpUser(signUpDto)

        res.status(201).json({ data: user })
    }

    signIn = async (
        req: Request,
        res: Response<ApiResponse<{ user: UserDto; token: string }>>
    ) => {
        const { email, password } = signInSchema.parse(req.body)
        const result = await this.authService.signInUser(email, password)

        res.status(200).json({
            data: result
        })
    }

    signOut = async (req: Request, res: Response) => {
        await this.authService.signOutUser(req.user.id)
        res.sendStatus(204)
    }
}

const userService = new UserService()
const authService = new AuthService(userService)
export const authController = new AuthController(authService)
