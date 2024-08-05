import { Event } from '@domain/event/entity/event.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Usecase } from '@usecases/usecase'

export type CreateEventInputDto = {
    name: string
    sportId: number
    maxParticipants: number
    datetime: Date
    startTime: Date
    endTime: Date
    location: string
    maxOfParticipantsWaitingList: number
    adminId: string
}

export type CreateEventOutputDto = {
    id: number
    name: string
    sportId: number
    maxParticipants: number
    createdAt: Date
    datetime: Date
    startTime: Date
    endTime: Date
    location: string
    maxOfParticipantsWaitingList: number
    adminId: string
}

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
        maxOfParticipantsWaitingList
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
            sportId: e.sportId,
            adminId: e.adminId,
            maxOfParticipantsWaitingList: e.maxOfParticipantsWaitingList
        }

        return output
    }
}
