import type { Usecase } from '../usecase'
import type {
    Participant,
    ParticipantStatus
} from '@domain/participants/entity/participants.entity'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'

export type FindParticipantByEventIdOutputDto =
    | {
          id: number
          eventId: number
          status: ParticipantStatus
          userId: string
          participantName?: string
          createdAt: Date
      }[]

export type FindParticipantsByEventInputDto = {
    eventId: number
}

export class FindParticipantsByEventIdUsecase
    implements Usecase<FindParticipantsByEventInputDto, FindParticipantByEventIdOutputDto>
{
    private constructor(private readonly participantGateway: ParticipantGateway) {}

    public static create(participantGateway: ParticipantGateway) {
        return new FindParticipantsByEventIdUsecase(participantGateway)
    }

    public async execute({
        eventId
    }: FindParticipantsByEventInputDto): Promise<FindParticipantByEventIdOutputDto> {
        const participants = await this.participantGateway.findParticipantsOfEvent(eventId)

        const output = this.presentOutput(participants)

        return output
    }

    private presentOutput(input: Participant[]): FindParticipantByEventIdOutputDto {
        if (!input) return []

        return input.map((participant) => ({
            id: participant.id,
            eventId: participant.eventId,
            status: participant.status,
            userId: participant.userId,
            participantName: participant.participantName,
            createdAt: participant.createdAt
        }))
    }
}
