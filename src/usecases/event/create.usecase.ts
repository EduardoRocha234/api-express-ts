import { Event, type EventProps } from '@domain/event/entity/event.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Usecase } from '@usecases/usecase'

export type CreateEventInputDto = Omit<EventProps, 'id' | 'participants' | 'createdAt'>

export type CreateEventOutputDto = Omit<EventProps, 'participants'>

export class CreateEventUsecase implements Usecase<CreateEventInputDto, CreateEventOutputDto> {
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new CreateEventUsecase(eventGateway)
    }

    public async execute({
        location,
        maxParticipants,
        name,
        datetime,
        startTime,
        endTime,
        sportId,
        adminId,
        maxOfParticipantsWaitingList,
        openParticipantsListDate
    }: CreateEventInputDto): Promise<CreateEventOutputDto> {
        const aEvent = Event.create(
            0,
            name,
            sportId,
            maxParticipants,
            location,
            datetime,
            startTime,
            endTime,
            openParticipantsListDate,
            maxOfParticipantsWaitingList,
            adminId
        )

        const eventCreated = await this.eventGateway.save(aEvent)

        const output = this.presentOutput(eventCreated)

        return output
    }

    private presentOutput(e: Event): CreateEventOutputDto {
        const output: CreateEventOutputDto = {
            id: e.id,
            createdAt: e.createdAt,
            location: e.location,
            maxParticipants: e.maxParticipants,
            name: e.name,
            datetime: e.datetime,
            startTime: e.startTime,
            endTime: e.endTime,
            openParticipantsListDate: e.openParticipantsListDate,
            sportId: e.sportId,
            adminId: e.adminId,
            maxOfParticipantsWaitingList: e.maxOfParticipantsWaitingList
        }

        return output
    }
}
