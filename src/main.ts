import { ApiExpress } from '@infra/api/express/api.express'
import { CreateUserRoute } from '@infra/api/express/routes/user/create-user.express.route'
import { ListUserRoute } from '@infra/api/express/routes/user/list-user.express.route'
import { BcryptAdapter } from '@infra/driven-adapter/bcrypt-adapter'
import { UserRepositoryPrisma } from '@infra/repositories/user/user.repository.prisma'
import { prisma } from '@package/prisma/prisma'
import { CreateUserUsecase } from '@usecases/user/create-user.usecase'
import { ListUserUsecase } from '@usecases/user/list-user.usecase'

const main = () => {
    const bcryptAdapter = new BcryptAdapter()
    const aRepository = UserRepositoryPrisma.create(prisma)

    const createUserUseCase = CreateUserUsecase.create(aRepository, bcryptAdapter)
    const listUserUseCase = ListUserUsecase.create(aRepository)

    const createUserRoute = CreateUserRoute.create(createUserUseCase)
    const listUserRoute = ListUserRoute.create(listUserUseCase)

    const api = ApiExpress.create([createUserRoute, listUserRoute])
    const port = 8000

    api.start(port)
}

main()
