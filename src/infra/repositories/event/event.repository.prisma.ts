import { PrismaClient } from '@prisma/client'
import { User } from '@domain/user/entity/user'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import { Event } from '@domain/event/entity/event.entity'
import {
    Participant,
    type ParticipantStatus
} from '@domain/participants/entity/participants.entity'

export class EventRepositoryPrisma implements EventGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new EventRepositoryPrisma(prismaClient)
    }

    public async save(event: Event): Promise<Event> {
        const { createdAt, location, maxParticipants, name, sportId } = event

        const data = {
            createdAt,
            location,
            maxParticipants,
            name,
            sportId
        }

        const eventCreated = await this.prismaClient.event.create({
            data
        })

        const aEvent = Event.with({
            id: eventCreated.id,
            createdAt: eventCreated.createdAt,
            location: eventCreated.location,
            maxParticipants: eventCreated.maxParticipants,
            name: eventCreated.name,
            sportId: eventCreated.sportId,
            participants: []
        })

        return aEvent
    }

    public async list(): Promise<Event[]> {
        const events = await this.prismaClient.event.findMany({
            include: {
                participants: true
            }
        })

        const eventsList = events.map((event) => {
            const eventWith = Event.with({
                id: event.id,
                createdAt: event.createdAt,
                location: event.location,
                maxParticipants: event.maxParticipants,
                name: event.name,
                sportId: event.sportId,
                participants: event.participants.map((participant) => {
                    return Participant.with({
                        eventId: participant.eventId,
                        id: participant.id,
                        status: participant.status as ParticipantStatus,
                        userId: participant.userId,
                        createdAt: participant.createdAt
                    })
                })
            })

            return eventWith
        })

        return eventsList
    }

    public async findById(id: number): Promise<Event | undefined> {
        const event = await this.prismaClient.event.findUnique({
            where: {
                id
            },
            include: {
                participants: true
            }
        })

        if (!event) return

        const aEvent = Event.with({
            id: event.id,
            createdAt: event.createdAt,
            location: event.location,
            maxParticipants: event.maxParticipants,
            name: event.name,
            sportId: event.sportId,
            participants: event.participants.map((participant) => {
                return Participant.with({
                    eventId: participant.eventId,
                    id: participant.id,
                    status: participant.status as ParticipantStatus,
                    userId: participant.userId,
                    createdAt: participant.createdAt
                })
            })
        })

        return aEvent
    }

    public async update(event: Event): Promise<Event> {
        const { id, createdAt, location, maxParticipants, name, sportId } = event

        const data = {
            createdAt,
            location,
            maxParticipants,
            name,
            sportId
        }

        const newEventUpdated = await this.prismaClient.event.update({
            where: { id },
            data
        })

        const getEvent = await this.findById(newEventUpdated.id)

        const aEvent = Event.with({
            id: getEvent!.id,
            createdAt: getEvent!.createdAt,
            location: getEvent!.location,
            maxParticipants: getEvent!.maxParticipants,
            name: getEvent!.name,
            sportId: getEvent!.sportId,
            participants: getEvent!.participants
        })

        return aEvent
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.event.delete({
            where: {
                id
            },
            include: {
                participants: true
            }
        })
    }
}
