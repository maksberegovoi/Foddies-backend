import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { ApiError } from '../../shared/http/errors/api.error'
import type { SignUpDto } from './schemas/sign-up.schema'
import { env } from '../../env'
import type UserService from '../user/user.service'
import type { UserDto, UserProfileDto } from '../user/dto/user.dto'
import { SignInResponseDto } from './schemas/sign-in-response.schema'

class AuthService {
    constructor(private readonly userService: UserService) {}

    async signUpUser(userData: SignUpDto): Promise<UserProfileDto> {
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        return this.userService.create({
            email: userData.email,
            name: userData.name,
            password: hashedPassword
        })
    }

    async signInUser(
        email: string,
        password: string
    ): Promise<SignInResponseDto> {
        const user = await this.userService.getUserByEmail({ email })

        if (!user || !(await bcrypt.compare(password, user.password)))
            throw ApiError.unauthorized('Invalid email or password')

        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN
        })
        await this.userService.updateUserToken(user.id, token)

        const { password: _, ...profile } = user
        return {
            ...profile,
            token
        }
    }

    async signOutUser(userId: string) {
        await this.userService.updateUserToken(userId, null)
    }
}

export default AuthService
