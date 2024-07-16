export type ParticipantStatus = 'confirmed' | 'waiting_list'

export const ParticipantStatusEnum = {
    CONFIRMED: 'confirmed' as ParticipantStatus,
    WATING_LIST: 'waiting_list' as ParticipantStatus
} as const

export type ParticipantProps = {
    id: number
    eventId: number
    userId: string
    createdAt: Date
    status: ParticipantStatus
}

export class Participant {
    private constructor(private props: ParticipantProps) {
        this.validation()
    }

    public static create(id: number, eventId: number, userId: string, status: ParticipantStatus): Participant {
        return new Participant({
            id,
            eventId,
            createdAt: new Date(),
            status,
            userId
        })
    }

    private validation() {
        // if (this.props.maxParticipants < 0) {
        //     throw new Error('Número de participantes deve ser maior que zero')
        // }
    }

    public static with(props: ParticipantProps) {
        return new Participant(props)
    }

    public get id(): number {
        return this.props.id
    }

    public get eventId() {
        return this.props.eventId
    }

    public get userId() {
        return this.props.userId
    }

    public get status() {
        return this.props.status
    }

    public get createdAt() {
        return this.props.createdAt
    }
}
