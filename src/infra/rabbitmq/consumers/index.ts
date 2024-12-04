import { EventRepositoryPrisma } from '@infra/repositories/event/event.repository.prisma'
import { RabbitMQClient } from '../rabbitmq-client'
import { EventConsumer } from './event.consumer'
import { prisma } from '@package/prisma/prisma'
import { OpenListEventNotifyUserConsumer } from './openListEventNotifyUsers.consumer'
import { FirebaseAdminService } from '@package/firebase/fire-base-admin'
import { UserRepositoryPrisma } from '@infra/repositories/user/user.repository.prisma'
import { EventNotificationsUsersRepositoryPrisma } from '@infra/repositories/event-notifications-users/event-notifications-users.repository.prisma'

async function startConsumers() {
    const rabbitMQClient = RabbitMQClient.create()

    await rabbitMQClient.connect()
    const firebaseService = FirebaseAdminService.initFireBaseService()

    const eventRepository = EventRepositoryPrisma.create(prisma)
    const userRepository = UserRepositoryPrisma.create(prisma)
    const saveUserWantsnotificationRepository =
        EventNotificationsUsersRepositoryPrisma.create(prisma)

    const eventConsmer = EventConsumer.create(rabbitMQClient, eventRepository)
    const sendEventOpenListNotificationConsumer = OpenListEventNotifyUserConsumer.create(
        rabbitMQClient,
        firebaseService,
        userRepository,
        eventRepository,
        saveUserWantsnotificationRepository
    )

    await sendEventOpenListNotificationConsumer.consumeMessages()
    await eventConsmer.consumeMessages()
}

startConsumers()
