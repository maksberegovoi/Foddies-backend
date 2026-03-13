import prisma from '../../prisma'
import type { Prisma } from '@prisma/client'
import { ApiError } from '../../shared/http/errors/api.error'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import type { UserDto, UserPublicDto } from './dto/user.dto'
import type { FollowPageDto } from './dto/follow-page.dto'
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

    async getUserById({ userId }: { userId: string }): Promise<UserPublicDto> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: userSelect
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return this.transformUserWithCounts(user)
    }

    async getUserByEmail({
        email
    }: {
        email: string
    }): Promise<UserPublicDto | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: userSelect
        })

        if (!user) {
            return null
        }

        return this.transformUserWithCounts(user)
    }

    async current({ userId }: { userId: string }): Promise<UserPublicDto> {
        const user = await prisma.user.findUnique({
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

        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    following: {
                        connect: { id: targetUserId }
                    }
                }
            })
        } catch {
            throw ApiError.badRequest('Unable to follow user')
        }
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

        try {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    following: {
                        disconnect: { id: targetUserId }
                    }
                }
            })
        } catch {
            throw ApiError.badRequest('Unable to unfollow user')
        }
    }

    async followers({
        userId,
        page,
        limit
    }: {
        userId: string
        page: number
        limit: number
    }): Promise<FollowPageDto> {
        const skip = (page - 1) * limit

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                followers: {
                    select: userSelect,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                },
                _count: { select: { followers: true } }
            }
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return {
            users: user.followers.map((f) => this.transformUserWithCounts(f)),
            page,
            total: user._count.followers,
            totalPages: Math.ceil(user._count.followers / limit)
        }
    }

    async following({
        userId,
        page,
        limit
    }: {
        userId: string
        page: number
        limit: number
    }): Promise<FollowPageDto> {
        const skip = (page - 1) * limit

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                following: {
                    select: userSelect,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                },
                _count: { select: { following: true } }
            }
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return {
            users: user.following.map((u) => this.transformUserWithCounts(u)),
            page,
            total: user._count.following,
            totalPages: Math.ceil(user._count.following / limit)
        }
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
