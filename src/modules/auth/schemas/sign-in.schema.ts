import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const signInSchema = registry.register(
    'SignInDto',
    z.object({
        email: z.email(),
        password: z.string().min(2)
    })
)

export type SignInDto = z.infer<typeof signInSchema>
