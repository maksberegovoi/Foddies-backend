import { z } from 'zod'
import { registry } from '../../api-docs/swagger'

export const idParamSchema = registry.register(
    'IdParamDto',
    z.object({ id: z.string() })
)
