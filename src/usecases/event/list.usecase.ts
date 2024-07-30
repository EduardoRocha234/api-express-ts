import type { Usecase } from '../usecase'
import type { ParticipantStatus } from '@domain/participants/entity/participants.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Event } from '@domain/event/entity/event.entity'

export type ListEventsOutputDto = {
    events: {
        id: number
        name: string
        sportId: number
        maxParticipants: number
        createdAt: Date
        datetime: Date
        startTime: Date
        endTime: Date
        location: string
        participants: {
            id: number
            userId: string
            participantName?: string
            status: ParticipantStatus
            createdAt: Date
        }[]
    }[]
}

export class ListEventUseCase implements Usecase<void, ListEventsOutputDto> {
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new ListEventUseCase(eventGateway)
    }

    public async execute(): Promise<ListEventsOutputDto> {
        const events = await this.eventGateway.list()

        const output = this.presentOutput(events)

        return output
    }

    private presentOutput(events: Event[]): ListEventsOutputDto {
        return {
            events: events.map((event) => ({
                id: event.id,
                name: event.name,
                sportId: event.sportId,
                maxParticipants: event.maxParticipants,
                createdAt: event.createdAt,
                location: event.location,
                datetime: event.datetime,
                startTime: event.startTime,
                endTime: event.endTime,
                participants: event.participants.map((participant) => ({
                    id: participant.id,
                    userId: participant.userId,
                    participantName: participant.participantName,
                    status: participant.status,
                    createdAt: participant.createdAt
                }))
            }))
        }
    }
}
