import {
    Participant,
    type ParticipantStatus
} from '@domain/participants/entity/participants.entity'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'
import type { Usecase } from '@usecases/usecase'

export type InsertParticipantInputDto = {
    eventId: number
    userId: string
    status: ParticipantStatus
}

export class InserParticipantUsecase implements Usecase<InsertParticipantInputDto, void> {
    private constructor(private readonly participantGateway: ParticipantGateway) {}

    public static create(participantGateway: ParticipantGateway) {
        return new InserParticipantUsecase(participantGateway)
    }

    public async execute({ eventId, status, userId }: InsertParticipantInputDto): Promise<void> {
        const aParticipant = Participant.create(0, eventId, userId, status)
        await this.participantGateway.save(aParticipant)
    }
}
