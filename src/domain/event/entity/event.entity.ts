import type { Participant } from '@domain/participants/entity/participants.entity'

export type EventProps = {
    id: number
    name: string
    sportId: number
    maxParticipants: number
    createdAt: Date
    location: string
    datetime: Date
    startTime: Date
    endTime: Date
    participants: Participant[]
}

export class Event {
    private constructor(private props: EventProps) {
        this.validation()
    }

    public static create(
        id: number,
        name: string,
        sportId: number,
        maxParticipants: number,
        location: string,
        datetime: Date,
        startTime: Date,
        endTime: Date,
        participants?: Participant[]
    ): Event {
        return new Event({
            id,
            name,
            sportId,
            maxParticipants,
            createdAt: new Date(),
            location,
            datetime,
            startTime,
            endTime,
            participants: participants || []
        })
    }

    private validation() {
        if (this.props.maxParticipants < 0) {
            throw new Error('Número de participantes deve ser maior que zero')
        }
    }

    public static with(props: EventProps) {
        return new Event(props)
    }

    public get id(): number {
        return this.props.id
    }

    public get name(): string {
        return this.props.name
    }

    public get sportId(): number {
        return this.props.sportId
    }

    public get maxParticipants(): number {
        return this.props.maxParticipants
    }

    public get createdAt(): Date {
        return this.props.createdAt
    }

    public get datetime(): Date {
        return this.props.datetime
    }

    public get location(): string {
        return this.props.location
    }

    public get participants(): Participant[] {
        return this.props.participants
    }

    public get startTime(): Date {
        return this.props.startTime
    }

    public get endTime(): Date {
        return this.props.endTime
    }
}
