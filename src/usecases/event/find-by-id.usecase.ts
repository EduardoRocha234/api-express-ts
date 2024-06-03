import type { Usecase } from '../usecase'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Event } from '@domain/event/entity/event.entity'
import type { Participant, ParticipantStatus } from '@domain/participants/entity/participants.entity'

export type FindEventInputDto = number

export type FindEventOutputDto =
    | {
          id: number
          name: string
          sportId: number
          maxParticipants: number
          dateTime: Date
          location: string
          participants: {
            id: number
            userId: string
            status: ParticipantStatus
        }[]
      }
    | undefined

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
            dateTime: input.dateTime,
            location: input.location,
            maxParticipants: input.maxParticipants,
            name: input.name,
            sportId: input.sportId,
            participants: input.participants
        }
    }
}
