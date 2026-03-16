import type { Request, Response } from 'express'
import AuthService from './auth.service'
import { signUpSchema } from './schemas/sign-up.schema'
import { signInSchema } from './schemas/sign-in.schema'
import UserService from '../user/user.service'
import type { ApiResponse } from '../../shared/http/types/api-response.type'
import type { UserProfileDto } from '../user/dto/user.dto'
import type { SignInResponseDto } from './schemas/sign-in-response.schema'

class AuthController {
    constructor(private readonly authService: AuthService) {}

    signUp = async (
        req: Request,
        res: Response<ApiResponse<UserProfileDto>>
    ) => {
        const signUpDto = signUpSchema.parse(req.body)
        const user = await this.authService.signUpUser(signUpDto)

        res.status(201).json({ data: user })
    }

    signIn = async (
        req: Request,
        res: Response<ApiResponse<SignInResponseDto>>
    ) => {
        const { email, password } = signInSchema.parse(req.body)
        const user = await this.authService.signInUser(email, password)

        res.status(200).json({
            data: user
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
