import type { PrismaClient } from '@prisma/client'
import type { Server as SocketIOServer } from 'socket.io'
import useUserProvider from './user.provider'
import useEventProvider from './event.provider'
import useSportsProvider from './sport.provider'
import { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import type { RabbitMQClient } from '@infra/rabbitmq/rabbitmq-client'
import notificationsProvider from './notifications.provider'

export default function initProviders(
    prismaClient: PrismaClient,
    io: SocketIOServer,
    rabbitMQClient: RabbitMQClient
) {
    // TODO: refatorar
    const jwtAdapter = new JwtAdapter()

    return [
        ...useUserProvider(prismaClient, jwtAdapter),
        ...useEventProvider(prismaClient, io, jwtAdapter, rabbitMQClient),
        ...useSportsProvider(prismaClient, jwtAdapter),
        ...notificationsProvider(prismaClient, jwtAdapter, rabbitMQClient)
    ]
}
