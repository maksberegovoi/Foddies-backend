import type { PaginationType } from './pagination.type'

export type ApiResponsePaginated<T> = {
    data: T[]
    meta: PaginationType
}
