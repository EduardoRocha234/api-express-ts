import type { Usecase } from '../usecase'
import type { Participant } from '@domain/participants/entity/participants.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Event, EventProps } from '@domain/event/entity/event.entity'

export type ListEventsOutputDto = {
    events: EventProps[]
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
                adminId: event.adminId,
                maxOfParticipantsWaitingList: event.maxOfParticipantsWaitingList,
                openParticipantsListDate: event.openParticipantsListDate,
                participants: event.participants.map((participant) => ({
                    id: participant.id,
                    userId: participant.userId,
                    participantName: participant.participantName,
                    status: participant.status,
                    createdAt: participant.createdAt
                })) as Participant[]
            })) as EventProps[]
        }
    }
}
