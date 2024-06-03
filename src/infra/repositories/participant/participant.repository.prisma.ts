import { PrismaClient } from '@prisma/client'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'
import {
    Participant,
    ParticipantStatusEnum,
    type ParticipantStatus
} from '@domain/participants/entity/participants.entity'

export class ParticipantRepositoryPrisma implements ParticipantGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new ParticipantRepositoryPrisma(prismaClient)
    }

    public async save(participant: Participant): Promise<void> {
        const { eventId, status, userId } = participant

        const data = {
            eventId,
            status,
            userId
        }

        await this.prismaClient.participant.create({
            data
        })
    }

    public async findByStatusAndEventId(
        eventId: number,
        status: ParticipantStatus
    ): Promise<Participant[]> {
        const participants = await this.prismaClient.participant.findMany({
            where: {
                eventId,
                status
            }
        })

        const participantList = participants.map((participant) =>
            Participant.with({
                eventId: participant.eventId,
                id: participant.id,
                status: participant.status as ParticipantStatus,
                userId: participant.userId
            })
        )

        return participantList
    }

    public async getCountParticipantsByStatusAndEventId(
        eventId: number,
        status: ParticipantStatus
    ): Promise<number> {
        const participantsCount = await this.prismaClient.participant.count({
            where: {
                eventId,
                status
            }
        })

        return participantsCount
    }
}
