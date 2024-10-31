import {
    EventNotificationsUsers,
    type EventNotificationsUsersProps
} from '@domain/eventNotificationsUsers/entity/event-notifications-users.entity'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'
import type { Usecase } from '@usecases/usecase'

export type SaveUserWantsNotificationInputDto = Omit<EventNotificationsUsersProps, 'id'>

export class SaveUserWantsNotificatioUseCase
    implements Usecase<SaveUserWantsNotificationInputDto, void>
{
    private constructor(
        private readonly eventNotificationsUsersGateway: EventNotificationsUsersGateway
    ) {}

    public static create(eventNotificationsUsersGateway: EventNotificationsUsersGateway) {
        return new SaveUserWantsNotificatioUseCase(eventNotificationsUsersGateway)
    }

    public async execute({
        eventId,
        userId,
        userPushToken
    }: SaveUserWantsNotificationInputDto): Promise<void> {
        const aEvent = EventNotificationsUsers.create(0, eventId, userId, userPushToken)

        return await this.eventNotificationsUsersGateway.save(aEvent)
    }
}
