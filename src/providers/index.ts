import type { PrismaClient } from '@prisma/client'
import type { Server as SocketIOServer } from 'socket.io'
import useUserProvider from './user.provider'
import useEventProvider from './event.provider'

export default function initProviders(prismaClient: PrismaClient, io: SocketIOServer) {
    return [...useUserProvider(prismaClient), ...useEventProvider(prismaClient, io)]
}
