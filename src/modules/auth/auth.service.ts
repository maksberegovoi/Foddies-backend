import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import prisma from '../../prisma'
import { ApiError } from '../../shared/http/errors/api.error'
import type { SignUpDto } from './schemas/sign-up.schema'
import { env } from '../../env'

class AuthService {
    constructor() {}

    async signUpUser(userData: SignUpDto) {
        const existingUser = await this.findUserByEmail(userData.email)

        if (existingUser)
            throw ApiError.conflict('User with this email already exists')

        const newUser = await prisma.user.create({
            data: {
                ...userData,
                password: await bcrypt.hash(userData.password, 10)
            }
        })
        return newUser
    }

    async signInUser(email: string, password: string) {
        const user = await this.findUserByEmail(email)
        if (!user || !(await bcrypt.compare(password, user.password)))
            throw ApiError.unauthorized('Invalid email or password')

        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN
        })

        return await this.updateUserToken(user.id, token)
    }

    async signOutUser(userId: string) {
        await this.updateUserToken(userId, null)
    }

    private async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        })
    }

    private async updateUserToken(userId: string, token: string | null) {
        return await prisma.user.update({
            where: { id: userId },
            data: { token }
        })
    }
}

export default AuthService
