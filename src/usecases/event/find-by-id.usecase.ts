import type { Usecase } from '../usecase'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Event, EventProps } from '@domain/event/entity/event.entity'

export type FindEventInputDto = number

export type FindEventOutputDto = EventProps | undefined

export class FindEventByIdUsecase implements Usecase<FindEventInputDto, FindEventOutputDto> {
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new FindEventByIdUsecase(eventGateway)
    }

    public async execute(id: number): Promise<FindEventOutputDto> {
        const event = await this.eventGateway.findById(id)

        const output = this.presentOutput(event)

        return output
    }

    private presentOutput(input?: Event): FindEventOutputDto {
        if (!input) return

        return {
            id: input.id,
            createdAt: input.createdAt,
            location: input.location,
            maxParticipants: input.maxParticipants,
            name: input.name,
            datetime: input.datetime,
            sportId: input.sportId,
            endTime: input.endTime,
            startTime: input.startTime,
            participants: input.participants,
            maxOfParticipantsWaitingList: input.maxOfParticipantsWaitingList,
            recurringDay: input.recurringDay,
            openParticipantsListDate: input.openParticipantsListDate,
            adminId: input.adminId
        } as EventProps
    }
}
