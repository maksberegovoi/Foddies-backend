export type UserDto = {
    id: string
    name: string
    email: string
    avatarURL: string | null
}

export type UserProfileDto = UserDto & {
    totalRecipes: number
    totalFollowers: number
    totalFavoriteRecipes: number
    totalFollowing: number
}

export type UserProfilePublicDto = Omit<
    UserProfileDto,
    'totalFavoriteRecipes' | 'totalFollowing'
>
