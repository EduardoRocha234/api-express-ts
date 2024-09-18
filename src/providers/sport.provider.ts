import type { PrismaClient } from '@prisma/client'
import { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import { AuthMiddleware } from '@infra/api/express/middlewares/auth.middleware'
import { SportRepositoryPrisma } from '@infra/repositories/sport/sport.repository'
import { ListSportsRoute } from '@infra/api/express/routes/sport/list-sports.express.route'
import { ListSportsUseCase } from '@usecases/sport/list.usecase'

export default function useSportsProvider(prismaClient: PrismaClient) {
    const jwtAdapter = new JwtAdapter()
    const authMiddleware = AuthMiddleware.create(jwtAdapter)

    const aRepository = SportRepositoryPrisma.create(prismaClient)

    const getAllSportsUseCase = ListSportsUseCase.create(aRepository)

    const getAllSportsRoute = ListSportsRoute.create(getAllSportsUseCase, [authMiddleware])

    return [getAllSportsRoute]
}
