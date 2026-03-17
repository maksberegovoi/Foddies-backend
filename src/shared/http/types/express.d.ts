import { type UserProfileDto } from '../../../modules/user/dto/user.dto'

declare global {
    namespace Express {
        interface Request {
            user: UserProfileDto
        }
    }
}

export {}
