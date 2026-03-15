import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const recipeDtoSchema = registry.register(
    'RecipeDto',
    z.object({
        id: z.string().openapi({ example: 'string' }),
        title: z.string().openapi({ example: 'Borscht' }),
        description: z
            .string()
            .openapi({ example: 'lorem ipsum dolor sit amet' }),
        instructions: z
            .string()
            .openapi({ example: 'lorem ipsum dolor sit amet' }),
        ingredients: z.array(
            z.object({
                measure: z.string().openapi({ example: '200g' }),
                name: z.string().openapi({ example: 'Meat' }),
                imageURL: z
                    .url()
                    .openapi({ example: 'https://example.com/meet.jpg' })
            })
        ),
        image: z.object({
            original: z
                .url()
                .openapi({ example: 'https://example.com/meet.jpg' }),
            phone: z.url().openapi({ example: 'https://example.com/meet.jpg' }),
            tablet: z
                .url()
                .openapi({ example: 'https://example.com/meet.jpg' }),
            desktop: z
                .url()
                .openapi({ example: 'https://example.com/meet.jpg' }),
            thumbnail: z
                .url()
                .openapi({ example: 'https://example.com/meet.jpg' })
        }),
        ownerId: z.string().openapi({ example: 'string' }),
        ownerAvatarURL: z
            .url()
            .nullable()
            .openapi({ example: 'https://avatar.com/1.jpg' }),
        ownerName: z.string().openapi({ example: 'Ivan' }),
        time: z.number().int().positive().openapi({ example: 60 }),
        category: z.string().openapi({ example: 'Soup' }),
        area: z.string().openapi({ example: 'Ukrainian' })
    })
)

export type RecipeDto = z.infer<typeof recipeDtoSchema>
