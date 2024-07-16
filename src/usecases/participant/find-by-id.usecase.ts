import type { Usecase } from '../usecase'
import type {
    Participant,
    ParticipantStatus
} from '@domain/participants/entity/participants.entity'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'

export type FindParticipantInputDto = string

export type FindParticipantOutputDto =
    | {
          id: number
          eventId: number
          status: ParticipantStatus
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

    public async execute(id: string): Promise<FindParticipantOutputDto> {
        const participant = await this.participantGateway.findByUserId(id)

        const output = this.presentOutput(participant)

        return output
    }

    private presentOutput(input?: Participant): FindParticipantOutputDto {
        if (!input) return

        return {
            id: input.id,
            eventId: input.eventId,
            status: input.status,
            userId: input.userId
        }
    }
}
