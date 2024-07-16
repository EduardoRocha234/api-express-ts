import type { Usecase } from '../usecase'
import type { ParticipantStatus } from '@domain/participants/entity/participants.entity'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'

export type getCountParticipantInputDto = {
    eventId: number
    status: ParticipantStatus
}

export type getCountParticipantsOutputDto = number

export class CountOfParticipantByEventIdAndStatusUsecase
    implements Usecase<getCountParticipantInputDto, getCountParticipantsOutputDto>
{
    private constructor(private readonly participantGateway: ParticipantGateway) {}

    public static create(participantGateway: ParticipantGateway) {
        return new CountOfParticipantByEventIdAndStatusUsecase(participantGateway)
    }

    public async execute({
        eventId,
        status
    }: getCountParticipantInputDto): Promise<getCountParticipantsOutputDto> {
        const count = await this.participantGateway.getCountParticipantsByStatusAndEventId(
            eventId,
            status
        )

        return count
    }
}
