import type { Usecase } from '../usecase'
import type { EventNotificationsUsers } from '@domain/eventNotificationsUsers/entity/event-notifications-users.entity'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'

export type GetUsersWantsNotificationsByEventAndUserIdInputDto = {
    eventId: number
    userId: string
}

export type GetUsersWantsNotificationsByEventAndUserIdOutputDto =
    | Omit<EventNotificationsUsers, 'userPushToken'>
    | undefined

export class GetUsersWantNotificationsByEventIdAndUserIdUseCase
    implements
        Usecase<
            GetUsersWantsNotificationsByEventAndUserIdInputDto,
            GetUsersWantsNotificationsByEventAndUserIdOutputDto
        >
{
    private constructor(
        private readonly eventNotificationsUsersGateway: EventNotificationsUsersGateway
    ) {}

    public static create(eventNotificationsUsersGateway: EventNotificationsUsersGateway) {
        return new GetUsersWantNotificationsByEventIdAndUserIdUseCase(eventNotificationsUsersGateway)
    }

    public async execute({
        eventId,
        userId
    }: GetUsersWantsNotificationsByEventAndUserIdInputDto): Promise<GetUsersWantsNotificationsByEventAndUserIdOutputDto> {
        const data = await this.eventNotificationsUsersGateway.getByEventIdAndUseId(eventId, userId)

        const output = this.presentOutput(data)

        return output
    }

    private presentOutput(
        input?: EventNotificationsUsers | null
    ): GetUsersWantsNotificationsByEventAndUserIdOutputDto {
        if (!input) return

        return {
            eventId: input.eventId,
            id: input.id,
            userId: input.userId
        } satisfies GetUsersWantsNotificationsByEventAndUserIdOutputDto
    }
}
