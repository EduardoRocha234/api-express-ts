import { Event } from '@domain/event/entity/event.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Usecase } from '@usecases/usecase'

export type CreateEventInputDto = {
    name: string
    sportId: number
    maxParticipants: number
    location: string
}

export type CreateEventOutputDto = {
    id: number
    name: string
    sportId: number
    maxParticipants: number
    createdAt: Date
    location: string
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
        sportId
    }: CreateEventInputDto): Promise<CreateEventOutputDto> {
        const aEvent = Event.create(0, name, sportId, maxParticipants, location)

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
            sportId: e.sportId
        }

        return output
    }
}
