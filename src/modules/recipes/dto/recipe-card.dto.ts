export interface RecipeCardDto {
    id: string
    title: string
    instructions: string
    ownerId: string
    ownerAvatarURL: string | null
    ownerName: string
    imageURL: string
}
