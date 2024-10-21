import type { PrismaClient } from '@prisma/client'
import type { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import type { Server as SocketIOServer } from 'socket.io'
import { AuthMiddleware } from '@infra/api/express/middlewares/auth.middleware'
import { EventRepositoryPrisma } from '@infra/repositories/event/event.repository.prisma'
import { CreateEventUsecase } from '@usecases/event/create.usecase'
import { CreateEventRoute } from '@infra/api/express/routes/event/create-event.express.route'
import { InserParticipantUsecase } from '@usecases/participant/create.usecase'
import { ParticipantRepositoryPrisma } from '@infra/repositories/participant/participant.repository.prisma'
import { InsertParticipantInEventRoute } from '@infra/api/express/routes/event/insert-participant.express.route'
import { FindEventByIdUsecase } from '@usecases/event/find-by-id.usecase'
import { FindEventByIdRoute } from '@infra/api/express/routes/event/find-by-id.express.route'
import { ListEventUseCase } from '@usecases/event/list.usecase'
import { ListEventRoute } from '@infra/api/express/routes/event/list-event.express.route'
import { RemoveParticipantRoute } from '@infra/api/express/routes/event/remove-participant.express.route'
import { FindParticipantsByEventIdAndStatusUsecase } from '@usecases/participant/find-by-event-and-status.usecase'
import { DeleteParticipantUseCase } from '@usecases/participant/delete.usecase'
import { FindParticipantByIdUseCase } from '@usecases/participant/find-by-id.usecase'
import { ChangeStatusOfParticipantUseCase } from '@usecases/participant/change-status.usecase'
import { FindParticipantsByEventIdUsecase } from '@usecases/participant/find-by-eventid.usecase'
import { ListUserParticipantsEventsUseCase } from '@usecases/event/find-user-participanting-events'
import { ListUserParticipantsEventsRoute } from '@infra/api/express/routes/event/find-user-participanting-events.route'
import { CreateEventsCronJob } from '../infra/crons/CreateEventCronJob.job'
import { EventProducer } from '@infra/rabbitmq/producers/event.producer'
import type { RabbitMQClient } from '@infra/rabbitmq/rabbitmq-client'

export default function useEventProvider(
    prismaClient: PrismaClient,
    socketIo: SocketIOServer,
    jwtAdapter: JwtAdapter,
    rabbitMQClient: RabbitMQClient
) {
    const authMiddleware = AuthMiddleware.create(jwtAdapter)

    const aRepository = EventRepositoryPrisma.create(prismaClient)
    const participantRepository = ParticipantRepositoryPrisma.create(prismaClient)

    const createEventUseCase = CreateEventUsecase.create(aRepository)
    const findEventByIdUseCase = FindEventByIdUsecase.create(aRepository)
    const getAllEventsUseCase = ListEventUseCase.create(aRepository)
    const listUserParticipantsEventsUseCase = ListUserParticipantsEventsUseCase.create(aRepository)

    const insertParticipantUseCase = InserParticipantUsecase.create(participantRepository)
    const findParticipantsOfEventUseCase =
        FindParticipantsByEventIdUsecase.create(participantRepository)
    const findParticipantByEventIdAndStatusUseCase =
        FindParticipantsByEventIdAndStatusUsecase.create(participantRepository)
    const removeParticipantUseCase = DeleteParticipantUseCase.create(participantRepository)
    const findParticipantByIdUseCase = FindParticipantByIdUseCase.create(participantRepository)
    const changeStatusOfParticipantUseCase =
        ChangeStatusOfParticipantUseCase.create(participantRepository)

    const insertParticipantRoute = InsertParticipantInEventRoute.create(
        findEventByIdUseCase,
        findParticipantsOfEventUseCase,
        insertParticipantUseCase,
        findParticipantByIdUseCase,
        socketIo,
        [authMiddleware]
    )
    const removeParticipantRoute = RemoveParticipantRoute.create(
        findEventByIdUseCase,
        findParticipantByEventIdAndStatusUseCase,
        removeParticipantUseCase,
        findParticipantByIdUseCase,
        socketIo,
        changeStatusOfParticipantUseCase,
        [authMiddleware]
    )
    const createEventRoute = CreateEventRoute.create(createEventUseCase, [authMiddleware])
    const findEventByIdRoute = FindEventByIdRoute.create(findEventByIdUseCase, [authMiddleware])
    const getAllEventsRoute = ListEventRoute.create(getAllEventsUseCase, [authMiddleware])
    const listUserParticipantsEventsRoute = ListUserParticipantsEventsRoute.create(
        listUserParticipantsEventsUseCase,
        [authMiddleware]
    )

    const eventProducer = EventProducer.create(rabbitMQClient)
    const createEventsJob = CreateEventsCronJob.create(aRepository, eventProducer)

    createEventsJob.execute()

    return [
        createEventRoute,
        findEventByIdRoute,
        getAllEventsRoute,
        insertParticipantRoute,
        removeParticipantRoute,
        listUserParticipantsEventsRoute
    ]
}
