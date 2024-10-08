import type { Usecase } from '../usecase'
import type { Participant } from '@domain/participants/entity/participants.entity'
import type { EventGateway, ListEventInput } from '@domain/event/gateway/event.gateway'
import type { Event, EventProps } from '@domain/event/entity/event.entity'
import type { PaginationOutput } from '@domain/shared/pagination.interface'

export type ListEventsOutputDto = {
    events: EventProps[]
    metadata: PaginationOutput
}

export class ListEventUseCase implements Usecase<ListEventInput, ListEventsOutputDto> {
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new ListEventUseCase(eventGateway)
    }

    public async execute({
        page,
        pageSize,
        sportId,
        initialPeriod,
        finalPeriod,
        locale
    }: ListEventInput): Promise<ListEventsOutputDto> {
        const { events, metadata } = await this.eventGateway.list({
            page,
            pageSize,
            sportId,
            initialPeriod,
            finalPeriod,
            locale
        })

        const output = this.presentOutput(events)

        return {
            events: output,
            metadata
        }
    }

    private presentOutput(events: Event[]): EventProps[] {
        return events.map((event) => ({
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
            description: event.description,
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
