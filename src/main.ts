import { ApiExpress } from '@infra/api/express/api.express'
import { prisma } from '@package/prisma/prisma'
import useUserProvider from './providers/user.provider'
import initProviders from './providers'

const main = () => {
    const routesProvider = initProviders(prisma)

    const api = ApiExpress.create(routesProvider)
    const port = 8000

    api.start(port)
}

main()
