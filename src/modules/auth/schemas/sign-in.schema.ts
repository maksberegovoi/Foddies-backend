import { z } from 'zod'

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(2)
})

export type SignInDto = z.infer<typeof signInSchema>
