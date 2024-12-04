import { PrismaClient } from '@prisma/client'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'
import { EventNotificationsUsers } from '@domain/eventNotificationsUsers/entity/event-notifications-users.entity'

export class EventNotificationsUsersRepositoryPrisma implements EventNotificationsUsersGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new EventNotificationsUsersRepositoryPrisma(prismaClient)
    }

    public async save(props: EventNotificationsUsers): Promise<void> {
        const { eventId, userId, userPushToken } = props

        const data = {
            eventId,
            userId,
            userPushToken
        }

        await this.prismaClient.eventNotificationsUser.create({
            data
        })
    }

    public async getByEventId(eventId: number): Promise<EventNotificationsUsers[]> {
        const res = await this.prismaClient.eventNotificationsUser.findMany({
            where: {
                eventId
            }
        })

        const list = res.map((item) => {
            const eventWith = EventNotificationsUsers.with({
                id: item.id,
                eventId: item.eventId,
                userId: item.userId,
                userPushToken: item.userPushToken
            })

            return eventWith
        })

        return list
    }

    public async getByEventIdAndUseId(
        eventId: number,
        userId: string
    ): Promise<EventNotificationsUsers | null> {
        const res = await this.prismaClient.eventNotificationsUser.findFirst({
            where: {
                eventId,
                userId
            }
        })

        if (!res) return null

        const eventWith = EventNotificationsUsers.with({
            id: res.id,
            eventId: res.eventId,
            userId: res.userId,
            userPushToken: res.userPushToken
        })

        return eventWith
    }

    public async delete(eventId: number, userId: string): Promise<void> {
        await this.prismaClient.eventNotificationsUser.deleteMany({
            where: { eventId, userId }
        })
    }
}
