import type { Request, Response } from 'express'
import AuthService from './auth.service'
import { signUpSchema } from './schemas/sign-up.schema'
import { signInSchema } from './schemas/sign-in.schema'

class AuthController {
    constructor(private readonly authService: AuthService) {}

    signUp = async (req: Request, res: Response) => {
        const signUpDto = signUpSchema.parse(req.body)
        const user = await this.authService.signUpUser(signUpDto)

        res.status(201).json({
            user
        })
    }

    signIn = async (req: Request, res: Response) => {
        const signInDto = signInSchema.parse(req.body)
        const user = await this.authService.signInUser(
            signInDto.email,
            signInDto.password
        )
        res.status(200).json({
            user,
            token: user.token
        })
    }

    signOut = async (req: Request, res: Response) => {
        await this.authService.signOutUser(req.user.id)
        res.sendStatus(204)
    }
}

export const authController = new AuthController(new AuthService())
