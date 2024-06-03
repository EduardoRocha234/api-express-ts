import type { PrismaClient } from '@prisma/client'
import useUserProvider from './user.provider'
import useEventProvider from './event.provider'

export default function initProviders(prismaClient: PrismaClient) {
    return [...useUserProvider(prismaClient), ...useEventProvider(prismaClient)]
}
