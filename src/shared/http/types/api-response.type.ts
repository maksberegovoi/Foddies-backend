import { z } from 'zod'

export type ApiResponse<T> = {
    data: T
}

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: dataSchema
    })
