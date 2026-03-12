export interface UserDto {
    id: string
    name: string
    email: string
}

export interface UserPublicDto extends UserDto {
    avatarURL: string | null
    totalRecipes: number
    totalFavoriteRecipes: number
    totalFollowers: number
    totalFollowing: number
}
