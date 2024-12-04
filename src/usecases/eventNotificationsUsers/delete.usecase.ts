import type { Usecase } from '../usecase'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'

export type DeleteUserEventNotificationInput = {
    eventId: number
    userId: string
}

export class DeleteUserEventNotificationUsecase
    implements Usecase<DeleteUserEventNotificationInput, void>
{
    private constructor(
        private readonly eventNotificationsUsersGateway: EventNotificationsUsersGateway
    ) {}

    public static create(eventNotificationsUsersGateway: EventNotificationsUsersGateway) {
        return new DeleteUserEventNotificationUsecase(eventNotificationsUsersGateway)
    }

    public async execute({ eventId, userId }: DeleteUserEventNotificationInput): Promise<void> {
        return await this.eventNotificationsUsersGateway.delete(eventId, userId)
    }
}
