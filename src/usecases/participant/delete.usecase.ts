import type { Usecase } from '../usecase'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'

export type RemoveParticipantInputDto = number

export type RemoveParticipantOutputDto = {
    sucess: boolean
}

export class DeleteParticipantUseCase implements Usecase<RemoveParticipantInputDto, void> {
    private constructor(private readonly participant: ParticipantGateway) {}

    public static create(participant: ParticipantGateway) {
        return new DeleteParticipantUseCase(participant)
    }

    public async execute(id: RemoveParticipantInputDto): Promise<void> {
        return await this.participant.delete(id)
    }
}
