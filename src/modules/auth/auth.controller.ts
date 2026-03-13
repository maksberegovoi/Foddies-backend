import type { Request, Response } from 'express'
import AuthService from './auth.service'
import { signUpSchema } from './schemas/sign-up.schema'
import { signInSchema } from './schemas/sign-in.schema'
import type { User } from '@prisma/client'
import type { UserDto } from '../user/dto/user.dto'

// TODO (TEMP) - Replace parsing to UserDto with user module method when it will be implemented
const toUserDto = (user: User): UserDto => {
    const { id, email, name } = user
    return { id, email, name }
}

class AuthController {
    constructor(private readonly authService: AuthService) {}

    signUp = async (req: Request, res: Response) => {
        const signUpDto = signUpSchema.parse(req.body)
        const user = await this.authService.signUpUser(signUpDto)
        res.status(201).json({
            user: toUserDto(user)
        })
    }

    signIn = async (req: Request, res: Response) => {
        const signInDto = signInSchema.parse(req.body)
        const user = await this.authService.signInUser(
            signInDto.email,
            signInDto.password
        )
        res.status(200).json({
            user: toUserDto(user),
            token: user.token
        })
    }

    signOut = async (req: Request, res: Response) => {
        await this.authService.signOutUser(req.user.id)
        res.sendStatus(204)
    }
}

export const authController = new AuthController(new AuthService())
