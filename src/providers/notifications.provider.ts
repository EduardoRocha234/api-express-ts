import type { PrismaClient } from '@prisma/client'
import { UserRepositoryPrisma } from '@infra/repositories/user/user.repository.prisma'
import type { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import { AuthMiddleware } from '@infra/api/express/middlewares/auth.middleware'
import { SaveUserPushTokenUseCase } from '@usecases/user/save-push-token.usecase'
import { SaveUserPushToken } from '@infra/api/express/routes/notifications/save-token.express.route'
import { SaveUserWantsNotificatioUseCase } from '@usecases/eventNotificationsUsers/save-user-want-notication.usecase'
import { EventNotificationsUsersRepositoryPrisma } from '@infra/repositories/event-notifications-users/event-notifications-users.repository.prisma'
import { SaveUserWantsNotificationRoute } from '@infra/api/express/routes/notifications/save-user-want-notification.express.route'
import type { RabbitMQClient } from '@infra/rabbitmq/rabbitmq-client'
import { OpenListEventsNotifyUsersProducer } from '@infra/rabbitmq/producers/openListEventNotifyUsers.producer'
import { OpenListEventsNotifyUsersJob } from '@infra/crons/OpenListEventsNotifyUsersJob.job'
import { EventRepositoryPrisma } from '@infra/repositories/event/event.repository.prisma'
import { FindUserByIdUsecase } from '@usecases/user/find-by-id.usecase'
import { GetUsersWantNotificationsByEventIdAndUserIdUseCase } from '@usecases/eventNotificationsUsers/get-by-event-id-and-user-id.usecase'
import { GetUsersWantNotificationsByEventIdAndUserIdRoute } from '@infra/api/express/routes/notifications/get-by-event-id-and-user-id.express.route'
import { DeleteUserEventNotificationUsecase } from '@usecases/eventNotificationsUsers/delete.usecase'
import { DisableNotificationEventRoute } from '@infra/api/express/routes/notifications/disable-event-notification.express.route'

export default function notificationsProvider(
    prismaClient: PrismaClient,
    jwtAdapter: JwtAdapter,
    rabbitMQClient: RabbitMQClient
) {
    const authMiddleware = AuthMiddleware.create(jwtAdapter)

    // repositories
    const userRepository = UserRepositoryPrisma.create(prismaClient)
    const eventRepository = EventRepositoryPrisma.create(prismaClient)
    const aRepository = EventNotificationsUsersRepositoryPrisma.create(prismaClient)

    // usecases
    const savePushTokenUseCase = SaveUserPushTokenUseCase.create(userRepository)
    const saveUserWantsNotificationUseCase = SaveUserWantsNotificatioUseCase.create(aRepository)
    const findUserByIdUseCase = FindUserByIdUsecase.create(userRepository)
    const getUsersWantNotificationsByEventIdAndUserIdUseCase =
        GetUsersWantNotificationsByEventIdAndUserIdUseCase.create(aRepository)
    const disbleNotificationUseCase = DeleteUserEventNotificationUsecase.create(aRepository)

    // rotas
    const savePushTokenRoute = SaveUserPushToken.create(savePushTokenUseCase, [authMiddleware])
    const saveUserWantsNotificationRoute = SaveUserWantsNotificationRoute.create(
        saveUserWantsNotificationUseCase,
        findUserByIdUseCase,
        [authMiddleware]
    )
    const getUsersWantNotificationsByEventIdAndUserIdRoute =
        GetUsersWantNotificationsByEventIdAndUserIdRoute.create(
            getUsersWantNotificationsByEventIdAndUserIdUseCase,
            [authMiddleware]
        )

    const eventProducer = OpenListEventsNotifyUsersProducer.create(rabbitMQClient)
    const sendNotificationsJob = OpenListEventsNotifyUsersJob.create(eventProducer, eventRepository)
    const disbleNotificationRoutes = DisableNotificationEventRoute.create(
        disbleNotificationUseCase,
        [authMiddleware]
    )

    sendNotificationsJob.execute()

    return [
        saveUserWantsNotificationRoute,
        savePushTokenRoute,
        getUsersWantNotificationsByEventIdAndUserIdRoute,
        disbleNotificationRoutes
    ]
}
