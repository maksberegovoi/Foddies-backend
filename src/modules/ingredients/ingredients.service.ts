import type { Ingredient } from '@prisma/client'
import prisma from '../../prisma'

export const getIngredients = async (): Promise<Ingredient[]> => {
    return await prisma.ingredient.findMany({
        orderBy: {
            name: 'asc'
        }
    })
}

export default {
    getIngredients
}
