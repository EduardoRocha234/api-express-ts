export type EventNotificationsUsersProps = {
    id: number
    eventId: number
    userId: string
    userPushToken: string | null
}

export class EventNotificationsUsers {
    private constructor(private props: EventNotificationsUsersProps) {}

    public static create(
        id: number,
        eventId: number,
        userId: string,
        userPushToken: string | null
    ): EventNotificationsUsers {
        return new EventNotificationsUsers({
            id,
            eventId,
            userId,
            userPushToken
        })
    }

    public static with(props: EventNotificationsUsersProps) {
        return new EventNotificationsUsers(props)
    }

    public get id(): number {
        return this.props.id
    }

    public get eventId(): number {
        return this.props.eventId
    }

    public get userId(): string {
        return this.props.userId
    }

    public get userPushToken(): string | null {
        return this.props.userPushToken
    }
}
