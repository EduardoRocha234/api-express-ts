import { EventRepositoryPrisma } from '@infra/repositories/event/event.repository.prisma'
import { RabbitMQClient } from '../rabbitmq-client'
import { EventConsumer } from './event.consumer'
import { prisma } from '@package/prisma/prisma'

async function startConsumers() {
    const rabbitMQClient = RabbitMQClient.create()

    await rabbitMQClient.connect()

    const aRepository = EventRepositoryPrisma.create(prisma)
    const eventConsmer = EventConsumer.create(rabbitMQClient, aRepository)

    await eventConsmer.consumeMessages()
}

startConsumers()
