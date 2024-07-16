import type { PrismaClient } from '@prisma/client'
import { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import { AuthMiddleware } from '@infra/api/express/middlewares/auth.middleware'
import { EventRepositoryPrisma } from '@infra/repositories/event/event.repository.prisma'
import { CreateEventUsecase } from '@usecases/event/create.usecase'
import { CreateEventRoute } from '@infra/api/express/routes/event/create-event.express.route'
import { InserParticipantUsecase } from '@usecases/participant/create.usecase'
import { ParticipantRepositoryPrisma } from '@infra/repositories/participant/participant.repository.prisma'
import { InsertParticipantInEventRoute } from '@infra/api/express/routes/event/insert-participant.express.route'
import { FindEventByIdUsecase } from '@usecases/event/find-by-id.usecase'
import { CountOfParticipantByEventIdAndStatusUsecase } from '@usecases/participant/count-by-eventId-and-status.usecase'
import { FindEventByIdRoute } from '@infra/api/express/routes/event/find-by-id.express.route'
import { ListEventUseCase } from '@usecases/event/list.usecase'
import { ListEventRoute } from '@infra/api/express/routes/event/list-event.express.route'
import { RemoveParticipantRoute } from '@infra/api/express/routes/event/remove-participant.express.route'
import { FindParticipantsByEventIdAndStatusUsecase } from '@usecases/participant/find-by-event-and-status.usecase'
import { DeleteParticipantUseCase } from '@usecases/participant/delete.usecase'
import { FindParticipantByIdUseCase } from '@usecases/participant/find-by-id.usecase'
import { ChangeStatusOfParticipantUseCase } from '@usecases/participant/change-status.usecase'

export default function useEventProvider(prismaClient: PrismaClient) {
    const jwtAdapter = new JwtAdapter()
    const authMiddleware = AuthMiddleware.create(jwtAdapter)

    const aRepository = EventRepositoryPrisma.create(prismaClient)
    const participantRepository = ParticipantRepositoryPrisma.create(prismaClient)

    const createEventUseCase = CreateEventUsecase.create(aRepository)
    const findEventByIdUseCase = FindEventByIdUsecase.create(aRepository)
    const getAllEventsUseCase = ListEventUseCase.create(aRepository)

    const insertParticipantUseCase = InserParticipantUsecase.create(participantRepository)
    const getCountOfParticipantsUseCase =
        CountOfParticipantByEventIdAndStatusUsecase.create(participantRepository)
    const findParticipantByEventIdAndStatusUseCase =
        FindParticipantsByEventIdAndStatusUsecase.create(participantRepository)
    const removeParticipantUseCase = DeleteParticipantUseCase.create(participantRepository)
    const findParticipantByIdUseCase = FindParticipantByIdUseCase.create(participantRepository)
    const changeStatusOfParticipantUseCase =
        ChangeStatusOfParticipantUseCase.create(participantRepository)

    const insertParticipantRoute = InsertParticipantInEventRoute.create(
        findEventByIdUseCase,
        getCountOfParticipantsUseCase,
        insertParticipantUseCase,
        [authMiddleware]
    )
    const removeParticipantRoute = RemoveParticipantRoute.create(
        findEventByIdUseCase,
        findParticipantByEventIdAndStatusUseCase,
        removeParticipantUseCase,
        findParticipantByIdUseCase,
        changeStatusOfParticipantUseCase,
        [authMiddleware]
    )
    const createEventRoute = CreateEventRoute.create(createEventUseCase, [authMiddleware])
    const findEventByIdRoute = FindEventByIdRoute.create(findEventByIdUseCase, [authMiddleware])
    const getAllEventsRoute = ListEventRoute.create(getAllEventsUseCase, [authMiddleware])

    return [
        createEventRoute,
        findEventByIdRoute,
        getAllEventsRoute,
        insertParticipantRoute,
        removeParticipantRoute
    ]
}
