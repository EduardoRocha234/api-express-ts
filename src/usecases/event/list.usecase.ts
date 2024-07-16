import type { User } from '@domain/user/entity/user'
import type { UserGateway } from '@domain/user/gateway/user.gateway'
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
        location: string
        participants: {
            id: number
            userId: string
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
                participants: event.participants.map((participant) => ({
                    id: participant.id,
                    userId: participant.userId,
                    status: participant.status,
                    createdAt: participant.createdAt,
                }))
            }))
        }
    }
}
