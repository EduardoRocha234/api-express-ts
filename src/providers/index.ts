import type { PrismaClient } from '@prisma/client'
import type { Server as SocketIOServer } from 'socket.io'
import useUserProvider from './user.provider'
import useEventProvider from './event.provider'
import useSportsProvider from './sport.provider'
import { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'
import type { RabbitMQClient } from '@infra/rabbitmq/rabbitmq-client'

export default function initProviders(
    prismaClient: PrismaClient,
    io: SocketIOServer,
    rabbitMQClient: RabbitMQClient
) {
    const jwtAdapter = new JwtAdapter()

    return [
        ...useUserProvider(prismaClient, jwtAdapter),
        ...useEventProvider(prismaClient, io, jwtAdapter, rabbitMQClient),
        ...useSportsProvider(prismaClient, jwtAdapter)
    ]
}
