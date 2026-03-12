import type { User } from '@prisma/client'

interface AuthUserDto {
    id: string
    name: string
    email: string
    avatarURL: string | null
}

export default AuthUserDto

export const toAuthUserDto = (user: User): AuthUserDto => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarURL: user.avatarURL
    }
}
