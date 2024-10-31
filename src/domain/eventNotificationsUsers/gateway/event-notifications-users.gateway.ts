import type { EventNotificationsUsers } from "../entity/event-notifications-users.entity"

export interface EventNotificationsUsersGateway {
    save(props: EventNotificationsUsers): Promise<void>
    getByEventId(eventId: number): Promise<EventNotificationsUsers[]>
}
