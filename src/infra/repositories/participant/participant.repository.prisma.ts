import { PrismaClient } from '@prisma/client'
import type { ParticipantGateway } from '@domain/participants/gateway/participants.gateway'
import {
    Participant,
    type ParticipantStatus
} from '@domain/participants/entity/participants.entity'

export class ParticipantRepositoryPrisma implements ParticipantGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new ParticipantRepositoryPrisma(prismaClient)
    }

    public async save(participant: Participant): Promise<void> {
        const { eventId, status, userId, createdAt } = participant

        const data = {
            eventId,
            status,
            userId,
            createdAt
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
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        const participantList = participants.map((participant) =>
            Participant.with({
                eventId: participant.eventId,
                id: participant.id,
                status: participant.status as ParticipantStatus,
                userId: participant.userId,
                createdAt: participant.createdAt
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

    public async changeStatusOfParticipant(id: number, status: ParticipantStatus): Promise<void> {
        await this.prismaClient.participant.update({
            where: {
                id
            },
            data: {
                status
            }
        })
    }

    public async findById(id: number): Promise<Participant | undefined> {
        const participant = await this.prismaClient.participant.findUnique({
            where: {
                id
            }
        })

        if (!participant) return

        const aParticipant = Participant.with({
            id: participant.id,
            eventId: participant.eventId,
            status: participant.status as ParticipantStatus,
            userId: participant.userId,
            createdAt: participant.createdAt
        })

        return aParticipant
    }

    public async findByUserId(userId: string): Promise<Participant | undefined> {
        const participant = await this.prismaClient.participant.findUnique({
            where: {
                userId
            }
        })

        if (!participant) return

        const aParticipant = Participant.with({
            id: participant.id,
            eventId: participant.eventId,
            status: participant.status as ParticipantStatus,
            userId: participant.userId,
            createdAt: participant.createdAt
        })

        return aParticipant
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.participant.delete({
            where: {
                id
            }
        })
    }
}
