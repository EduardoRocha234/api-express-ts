import { ApiExpress } from '@infra/api/express/api.express'
import { prisma } from '@package/prisma/prisma'
import initProviders from './providers'
import { RabbitMQClient } from '@infra/rabbitmq/rabbitmq-client'

const main = async () => {
    const port = 8000
    const api = ApiExpress.create()
    const io = api.getIO()

    const rabbitMQClient = RabbitMQClient.create()

    await rabbitMQClient.connect()

    const routesProvider = initProviders(prisma, io, rabbitMQClient)

    api.addRoutes(routesProvider)

    io.on('connection', (socket) => {
        console.log(`A user connected`)
        socket.emit('message', 'Server connected')
    })

    api.start(port)
}

main()
