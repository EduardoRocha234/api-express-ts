import type { Usecase } from '../usecase'
import type { ParticipantStatus } from '@domain/participants/entity/participants.entity'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'

export type ChangeStatusOfParticipantInputDto = {
    id: number
    status: ParticipantStatus
}

export type ChangeStatusOfParticipantOutputDto = void

export class ChangeStatusOfParticipantUseCase
    implements Usecase<ChangeStatusOfParticipantInputDto, ChangeStatusOfParticipantOutputDto>
{
    private constructor(private readonly participantGateway: ParticipantGateway) {}

    public static create(participantGateway: ParticipantGateway) {
        return new ChangeStatusOfParticipantUseCase(participantGateway)
    }

    public async execute({
        id,
        status
    }: ChangeStatusOfParticipantInputDto): Promise<ChangeStatusOfParticipantOutputDto> {
        await this.participantGateway.changeStatusOfParticipant(id, status)
    }
}
