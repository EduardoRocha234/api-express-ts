import type { PrismaClient } from '@prisma/client'
import useUserProvider from './user.provider'

export default function initProviders(prismaClient: PrismaClient) {
    return [...useUserProvider(prismaClient)]
}