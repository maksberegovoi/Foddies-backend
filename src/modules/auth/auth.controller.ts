import type { Request, Response } from 'express'
import AuthService from './auth.service'
import { signUpSchema } from './schemas/sign-up.schema'
import { toAuthUserDto } from './dto/auth-user.dto'
import { signInSchema } from './schemas/sign-in.schema'
import getUser from '../../shared/helpers/get-user'

class AuthController {
    constructor(private readonly authService: AuthService) {}

    signUp = async (req: Request, res: Response) => {
        const signUpDto = signUpSchema.parse(req.body)
        const user = await this.authService.signUpUser(signUpDto)
        res.status(201).json({
            user: toAuthUserDto(user),
            message: 'User was created successfully'
        })
    }

    signIn = async (req: Request, res: Response) => {
        const signInDto = signInSchema.parse(req.body)
        const user = await this.authService.signInUser(
            signInDto.email,
            signInDto.password
        )
        res.status(200).json({
            user: toAuthUserDto(user),
            token: user.token,
            message: 'User signed in successfully'
        })
    }

    signOut = async (req: Request, res: Response) => {
        const user = getUser(req)
        await this.authService.signOutUser(user.id)
        res.status(204).send()
    }
}

export const authController = new AuthController(new AuthService())
