import prisma from '../../prisma'
import type { Prisma } from '@prisma/client'
import { ApiError } from '../../shared/http/errors/api.error'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import type { UserDto, UserPublicDto } from './dto/user.dto'
import type { CreateUserDto } from './schemas/create-user.schema'

const userSelect = {
    id: true,
    email: true,
    name: true,
    avatarURL: true,
    createdAt: true,
    updatedAt: true,
    _count: {
        select: {
            recipes: true,
            favoriteRecipes: true,
            followers: true,
            following: true
        }
    }
} as const satisfies Prisma.UserSelect

type UserWithCounts = Prisma.UserGetPayload<{ select: typeof userSelect }>

class UserService {
    private transformUserWithCounts(user: UserWithCounts): UserPublicDto {
        const { _count, ...userData } = user
        return {
            ...userData,
            totalRecipes: _count.recipes,
            totalFavoriteRecipes: _count.favoriteRecipes,
            totalFollowers: _count.followers,
            totalFollowing: _count.following
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await prisma.user.create({
            data: createUserDto
        })

        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }

    async getUserById({ userId }: { userId: string }): Promise<UserDto> {
        const user = await prisma.user.findFirst({
            where: { id: userId }
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return user
    }

    async getUserByEmail({
        email
    }: {
        email: string
    }): Promise<UserDto | null> {
        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            return null
        }

        return user
    }

    async current({ userId }: { userId: string }): Promise<UserPublicDto> {
        const user = await prisma.user.findFirst({
            where: { id: userId },
            select: userSelect
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return this.transformUserWithCounts(user)
    }

    async follow({
        userId,
        targetUserId
    }: {
        userId: string
        targetUserId: string
    }): Promise<void> {
        if (userId === targetUserId) {
            throw ApiError.badRequest('You cannot follow yourself')
        }

        const existingRelation = await prisma.user.findFirst({
            where: {
                id: userId,
                following: {
                    some: {
                        id: targetUserId
                    }
                }
            }
        })

        if (existingRelation) {
            throw ApiError.badRequest('You are already following this user')
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                following: {
                    connect: { id: targetUserId }
                }
            }
        })
    }

    async unfollow({
        userId,
        targetUserId
    }: {
        userId: string
        targetUserId: string
    }): Promise<void> {
        if (userId === targetUserId) {
            throw ApiError.badRequest('You cannot unfollow yourself')
        }

        const existingRelation = await prisma.user.findFirst({
            where: {
                id: userId,
                following: {
                    some: {
                        id: targetUserId
                    }
                }
            }
        })

        if (!existingRelation) {
            throw ApiError.badRequest('You are not following this user')
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                following: {
                    disconnect: { id: targetUserId }
                }
            }
        })
    }

    async followers({ userId }: { userId: string }): Promise<UserPublicDto[]> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                followers: { select: userSelect }
            }
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }
        return user.followers.map((follower) =>
            this.transformUserWithCounts(follower)
        )
    }

    async following({ userId }: { userId: string }): Promise<UserPublicDto[]> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                following: { select: userSelect }
            }
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return user.following.map((user) => this.transformUserWithCounts(user))
    }

    async uploadAvatar({
        userId,
        file
    }: {
        file?: Express.Multer.File
        userId: string
    }): Promise<string> {
        if (!file) {
            throw ApiError.badRequest('No file provided')
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarURL: true }
        })

        if (!currentUser) {
            throw ApiError.notFound('User not found')
        }

        if (currentUser.avatarURL) {
            try {
                const oldAvatarPath = path.resolve(
                    'public',
                    currentUser.avatarURL.substring(1)
                )
                await fs.unlink(oldAvatarPath)
            } catch (error) {
                console.warn(`Failed to delete old avatar: ${error}`)
            }
        }

        const newPath = path.resolve('public', 'avatars', file.filename)
        await fs.rename(file.path, newPath)
        const avatarURL = path.join('/avatars', file.filename)

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarURL
            }
        })

        return avatarURL
    }
}

export default UserService
