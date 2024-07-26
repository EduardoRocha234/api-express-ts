import type { Usecase } from '../usecase'
import type {
    Participant,
    ParticipantStatus
} from '@domain/participants/entity/participants.entity'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'

export type FindParticipantInputDto = {
    userId: string
    eventId: number
}

export type FindParticipantOutputDto =
    | {
          id: number
          eventId: number
          status: ParticipantStatus
          participantName?: string
          userId: string
      }
    | undefined

export class FindParticipantByIdUseCase
    implements Usecase<FindParticipantInputDto, FindParticipantOutputDto>
{
    private constructor(private readonly participantGateway: ParticipantGateway) {}

    public static create(participantGateway: ParticipantGateway) {
        return new FindParticipantByIdUseCase(participantGateway)
    }

    public async execute({
        eventId,
        userId
    }: FindParticipantInputDto): Promise<FindParticipantOutputDto> {
        const participant = await this.participantGateway.findByUserIdAndEventId(userId, eventId)

        const output = this.presentOutput(participant)

        return output
    }

    private presentOutput(input?: Participant): FindParticipantOutputDto {
        if (!input) return

        return {
            id: input.id,
            eventId: input.eventId,
            status: input.status,
            participantName: input.participantName,
            userId: input.userId
        }
    }
}
