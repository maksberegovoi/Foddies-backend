import prisma from '../../prisma'
import type { Prisma } from '@prisma/client'
import { ApiError } from '../../shared/http/errors/api.error'

import type { UserProfileDto, UserProfilePublicDto } from './dto/user.dto'
import type { CreateUserDto } from './schemas/create-user.schema'
import type { PaginationQuery } from './schemas/pagination-query.schema'
import type { PaginationType } from '../../shared/http/types/pagination.type'
import {
    deleteFromCloudinary,
    uploadToCloudinary
} from '../../shared/fileUpload/cloudinary'

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
    private toUserProfileDto(user: UserWithCounts): UserProfileDto {
        const { _count, ...userData } = user
        return {
            ...userData,
            totalRecipes: _count.recipes,
            totalFavoriteRecipes: _count.favoriteRecipes,
            totalFollowers: _count.followers,
            totalFollowing: _count.following
        }
    }

    private toUserProfilePublicDto(user: UserWithCounts): UserProfilePublicDto {
        const { _count, ...userData } = user
        return {
            ...userData,
            totalRecipes: _count.recipes,
            totalFollowers: _count.followers
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
        const user = await prisma.user.create({
            data: createUserDto
        })

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarURL: user.avatarURL,
            totalFavoriteRecipes: 0,
            totalFollowers: 0,
            totalRecipes: 0,
            totalFollowing: 0
        }
    }

    async getUserById({
        userId
    }: {
        userId: string
    }): Promise<UserProfilePublicDto> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: userSelect
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return this.toUserProfilePublicDto(user)
    }

    async getUserByEmail({
        email
    }: {
        email: string
    }): Promise<(UserProfileDto & { password: string }) | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                ...userSelect,
                password: true
            }
        })

        if (!user) {
            return null
        }

        return {
            ...this.toUserProfileDto(user),
            password: user.password
        }
    }

    async updateUserToken(userId: string, token: string | null) {
        return prisma.user.update({
            where: { id: userId },
            data: { token }
        })
    }

    async current({ userId }: { userId: string }): Promise<UserProfileDto> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: userSelect
        })

        if (!user) {
            throw ApiError.notFound('User not found')
        }

        return this.toUserProfileDto(user)
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

    async followers(
        query: PaginationQuery,
        userId: string
    ): Promise<{ items: UserProfilePublicDto[] } & PaginationType> {
        const { limit, page } = query
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
            items: user.followers.map((f) => this.toUserProfilePublicDto(f)),
            page,
            limit,
            total: user._count.followers
        }
    }

    async following(
        query: PaginationQuery,
        userId: string
    ): Promise<{ items: UserProfilePublicDto[] } & PaginationType> {
        const { limit, page } = query
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
            items: user.following.map((u) => this.toUserProfilePublicDto(u)),
            page,
            limit,
            total: user._count.following
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
            select: { avatarPublicId: true }
        })

        if (!currentUser) {
            throw ApiError.notFound('User not found')
        }

        if (currentUser.avatarPublicId) {
            await deleteFromCloudinary(currentUser.avatarPublicId)
        }
        const { originalUrl: avatarURL, publicId } = await uploadToCloudinary(
            file.buffer,
            'avatars'
        )

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarPublicId: publicId,
                avatarURL
            }
        })

        return avatarURL
    }
}

export default UserService
