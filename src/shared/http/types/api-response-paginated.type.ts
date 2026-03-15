import { PaginationTypeSchema, PaginationType } from './pagination.type'
import { z } from 'zod'

export type ApiResponsePaginated<T> = {
    data: T[]
    meta: PaginationType
}

export const ApiResponsePaginatedSchema = <T extends z.ZodTypeAny>(
    dataSchema: T
) =>
    z.object({
        data: z.array(dataSchema),
        meta: PaginationTypeSchema
    })
