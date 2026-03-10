import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma

export const initDb = async () => {
    await prisma.$connect()
    console.log('DB connected')
}
