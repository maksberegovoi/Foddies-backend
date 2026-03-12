export interface RecipeCardDto {
    title: string
    instructions: string
    ownerId: string
    ownerAvatarURL: string | null
    ownerName: string
    imageURL: string
    isFavorite: boolean
}
