import { z } from 'zod'

export const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.email()
})

export type CreateUserDto = z.infer<typeof createUserSchema>
