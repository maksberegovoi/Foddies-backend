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
    image: {
        original: string
        phone: string
        tablet: string
        desktop: string
        thumbnail: string
    }
    ownerId: string
    ownerAvatarURL: string | null
    ownerName: string
    time: number
    category: string
    area: string
}
