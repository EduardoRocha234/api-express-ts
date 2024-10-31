import type { Usecase } from '../usecase'
import type { EventNotificationsUsers } from '@domain/eventNotificationsUsers/entity/event-notifications-users.entity'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'

export class GetUsersWantNotificationsByEventIdUseCase
    implements Usecase<number, EventNotificationsUsers[]>
{
    private constructor(
        private readonly eventNotificationsUsersGateway: EventNotificationsUsersGateway
    ) {}

    public static create(eventNotificationsUsersGateway: EventNotificationsUsersGateway) {
        return new GetUsersWantNotificationsByEventIdUseCase(eventNotificationsUsersGateway)
    }

    public async execute(eventId: number): Promise<EventNotificationsUsers[]> {
        const data = await this.eventNotificationsUsersGateway.getByEventId(eventId)

        return data
    }
}
