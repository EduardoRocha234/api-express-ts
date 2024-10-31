import { PrismaClient } from '@prisma/client'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'
import { EventNotificationsUsers } from '@domain/eventNotificationsUsers/entity/event-notifications-users.entity'

export class EventNotificationsUsersRepositoryPrisma implements EventNotificationsUsersGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new EventNotificationsUsersRepositoryPrisma(prismaClient)
    }

    public async save(props: EventNotificationsUsers): Promise<void> {
        const { eventId, id, userId, userPushToken } = props

        const data = {
            eventId,
            id,
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
}
