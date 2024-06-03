import type { PrismaClient } from '@prisma/client'
import { CreateUserRoute } from '@infra/api/express/routes/user/create-user.express.route'
import { ListUserRoute } from '@infra/api/express/routes/user/list-user.express.route'
import { BcryptAdapter } from '@infra/driven-adapter/bcrypt-adapter'
import { UserRepositoryPrisma } from '@infra/repositories/user/user.repository.prisma'
import { CreateUserUsecase } from '@usecases/user/create-user.usecase'
import { ListUserUsecase } from '@usecases/user/list-user.usecase'
import { FindUserByIdUsecase } from '@usecases/user/find-by-id.usecase'
import { FindUserByIdRoute } from '@infra/api/express/routes/user/find-by-id.express.route'
import { LoginRoute } from '@infra/api/express/routes/user/login.express.route'
import { FindUserByEmailUsecase } from '@usecases/user/find-by-email.usecase'
import { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import { DeleteUserUsecase } from '@usecases/user/delete.usecase'
import { DeleteUserRoute } from '@infra/api/express/routes/user/delete.express.route'
import { AuthMiddleware } from '@infra/api/express/middlewares/auth.middleware'

export default function useUserProvider(prismaClient: PrismaClient) {
    const bcryptAdapter = new BcryptAdapter()
    const jwtAdapter = new JwtAdapter()
    const authMiddleware = AuthMiddleware.create(jwtAdapter)

    const aRepository = UserRepositoryPrisma.create(prismaClient)

    const createUserUseCase = CreateUserUsecase.create(aRepository, bcryptAdapter)
    const listUserUseCase = ListUserUsecase.create(aRepository)
    const findUserByIdUseCase = FindUserByIdUsecase.create(aRepository)
    const findUserByEmailUseCase = FindUserByEmailUsecase.create(aRepository)
    const deleteUserUseCase = DeleteUserUsecase.create(aRepository)

    const createUserRoute = CreateUserRoute.create(createUserUseCase, findUserByEmailUseCase)
    const listUserRoute = ListUserRoute.create(listUserUseCase, [authMiddleware])
    const findUserByIdRoute = FindUserByIdRoute.create(findUserByIdUseCase, [authMiddleware])
    const deleteUserRoute = DeleteUserRoute.create(deleteUserUseCase, findUserByIdUseCase, [
        authMiddleware
    ])
    const loginUserRoute = LoginRoute.create(findUserByEmailUseCase, jwtAdapter, bcryptAdapter)

    return [createUserRoute, listUserRoute, findUserByIdRoute, loginUserRoute, deleteUserRoute]
}
