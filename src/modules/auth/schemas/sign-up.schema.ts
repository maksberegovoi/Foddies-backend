import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const signUpSchema = registry.register(
    'SignUpDto',
    z.object({
        name: z.string().min(2),
        email: z.email(),
        password: z.string().min(2)
    })
)

export type SignUpDto = z.infer<typeof signUpSchema>
