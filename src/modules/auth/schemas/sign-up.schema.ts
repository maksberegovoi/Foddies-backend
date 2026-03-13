import { z } from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(2)
})

export type SignUpDto = z.infer<typeof signUpSchema>
