import { ApiExpress } from '@infra/api/express/api.express'
import { prisma } from '@package/prisma/prisma'
import initProviders from './providers'

const main = () => {
    const port = 8000
    const api = ApiExpress.create()
    const io = api.getIO()

    const routesProvider = initProviders(prisma, io)
    api.addRoutes(routesProvider)

    io.on('connection', (socket) => {
        console.log(`A user connected`)
        socket.emit('message', 'Server connected')
    })

    api.start(port)
}

main()
