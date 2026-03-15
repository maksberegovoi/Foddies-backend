import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { ApiError } from '../../shared/http/errors/api.error'
import type { SignUpDto } from './schemas/sign-up.schema'
import { env } from '../../env'
import type UserService from '../user/user.service'
import type { UserDto } from '../user/dto/user.dto'

class AuthService {
    constructor(private readonly userService: UserService) {}

    async signUpUser(userData: SignUpDto): Promise<UserDto> {
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
    ): Promise<UserDto & { token: string }> {
        const user = await this.userService.getUserByEmail({ email })

        if (!user || !(await bcrypt.compare(password, user.password)))
            throw ApiError.unauthorized('Invalid email or password')

        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN
        })
        await this.userService.updateUserToken(user.id, token)
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarURL: user.avatarURL,
            token
        }
    }

    async signOutUser(userId: string) {
        await this.userService.updateUserToken(userId, null)
    }
}

export default AuthService
