export class ApiError extends Error {
    public readonly status: number

    private constructor(status: number, message: string) {
        super(message)
        this.status = status

        Object.setPrototypeOf(this, ApiError.prototype)
    }

    static badRequest(message: string) {
        return new ApiError(400, message)
    }

    static forbidden(message: string) {
        return new ApiError(403, message)
    }

    static internal(message: string) {
        return new ApiError(500, message)
    }

    static unauthorized(message: string) {
        return new ApiError(401, message)
    }

    static notFound(message: string) {
        return new ApiError(404, message)
    }

    static conflict(message: string) {
        return new ApiError(409, message)
    }
}

export default ApiError
