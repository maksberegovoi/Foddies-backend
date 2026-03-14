export interface RecipeDto {
    id: string
    title: string
    description: string
    instructions: string
    ingredients: {
        measure: string
        name: string
        imageURL: string
    }[]
    imageURL: string
    ownerId: string
    ownerAvatarURL: string | null
    ownerName: string
    time: number
    category: string
    area: string
}
