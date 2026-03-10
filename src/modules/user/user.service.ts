import prisma from '../../prisma'
import { type CreateUserDto } from './schemas/create-user.schema'
import type { UserDto } from './dto/user.dto'

class UserService {
    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await prisma.user.create({
            data: createUserDto
        })

        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }
}

export default UserService
