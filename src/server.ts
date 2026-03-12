import 'dotenv/config'

import { env } from './env'
import app from './app'
import prisma, { initDb } from './prisma'

let server: ReturnType<typeof app.listen>

const shutdown = async (signal: string) => {
    console.log(`${signal} received: starting graceful shutdown`)

    try {
        if (server) {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        return reject(error)
                    }

                    resolve()
                })
            })
        }

        await prisma.$disconnect()

        console.log('Graceful shutdown completed')
        process.exit(0)
    } catch (error) {
        console.error('Error during graceful shutdown', error)
        process.exit(1)
    }
}

const start = async () => {
    try {
        await initDb()

        server = app.listen(env.PORT, () => {
            console.log(`SERVER WAS STARTED ON PORT ${env.PORT}`)
        })
    } catch (error) {
        console.error('Server failed to start', error)
        await prisma.$disconnect()
        process.exit(1)
    }
}
process.on('SIGINT', () => {
    void shutdown('SIGINT')
})

process.on('SIGTERM', () => {
    void shutdown('SIGTERM')
})

void start()
