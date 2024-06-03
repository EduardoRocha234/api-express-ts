import { Event } from '@domain/event/entity/event.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Usecase } from '@usecases/usecase'

export type CreateEventInputDto = {
    name: string
    sportId: number
    maxParticipants: number
    dateTime: Date
    location: string
}

export type CreateEventOutputDto = {
    id: number
    name: string
    sportId: number
    maxParticipants: number
    dateTime: Date
    location: string
}

export class CreateEventUsecase implements Usecase<CreateEventInputDto, CreateEventOutputDto> {
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new CreateEventUsecase(eventGateway)
    }

    public async execute({
        dateTime,
        location,
        maxParticipants,
        name,
        sportId
    }: CreateEventInputDto): Promise<CreateEventOutputDto> {
        const aEvent = Event.create(0, name, sportId, maxParticipants, dateTime, location)

        const eventCreated = await this.eventGateway.save(aEvent)

        const output = this.presentOutput(eventCreated)

        return output
    }

    private presentOutput(e: Event): CreateEventOutputDto {
        const output: CreateEventOutputDto = {
            id: e.id,
            dateTime: e.dateTime,
            location: e.location,
            maxParticipants: e.maxParticipants,
            name: e.name,
            sportId: e.sportId
        }

        return output
    }
}
