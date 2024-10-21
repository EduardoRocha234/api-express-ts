import type { Usecase } from '../usecase'
import type { Participant } from '@domain/participants/entity/participants.entity'
import type {
    EventGateway,
    ListEventsFindByUserParticipantingInputDto
} from '@domain/event/gateway/event.gateway'
import type { Event, EventProps } from '@domain/event/entity/event.entity'

export type ListEventByUserParticipantingsOutputDto = {
    events: EventProps[]
}

export class ListUserParticipantsEventsUseCase
    implements Usecase<ListEventsFindByUserParticipantingInputDto, ListEventByUserParticipantingsOutputDto>
{
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new ListUserParticipantsEventsUseCase(eventGateway)
    }

    public async execute({
        userId
    }: ListEventsFindByUserParticipantingInputDto): Promise<ListEventByUserParticipantingsOutputDto> {
        const events = await this.eventGateway.findUserParticipatingEvents({ userId })

        const output = this.presentOutput(events)

        return {
            events: output
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
            daysBeforeOpeningList: event.daysBeforeOpeningList,
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
