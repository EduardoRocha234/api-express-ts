import { PrismaClient } from '@prisma/client'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import { EdaysOfWeek, Event } from '@domain/event/entity/event.entity'
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
        const {
            createdAt,
            location,
            maxParticipants,
            name,
            sportId,
            datetime,
            endTime,
            startTime,
            adminId,
            openParticipantsListDate,
            recurringDay,
            maxOfParticipantsWaitingList
        } = event

        const data = {
            createdAt,
            location,
            maxParticipants,
            name,
            sportId,
            endTime,
            startTime,
            datetime,
            adminId,
            maxOfParticipantsWaitingList,
            recurringDay,
            openParticipantsListDate
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
            datetime: eventCreated.datetime,
            startTime: eventCreated.startTime,
            endTime: eventCreated.endTime,
            adminId: eventCreated.adminId,
            recurringDay: eventCreated.recurringDay as keyof typeof EdaysOfWeek | null,
            maxOfParticipantsWaitingList: eventCreated.maxOfParticipantsWaitingList,
            openParticipantsListDate: eventCreated.openParticipantsListDate,
            participants: []
        })

        return aEvent
    }

    public async saveMany(events: Event[]): Promise<void> {
        await this.prismaClient.event.createMany({
            data: events,
            skipDuplicates: true
        })
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
                datetime: event.datetime,
                startTime: event.startTime,
                endTime: event.endTime,
                openParticipantsListDate: event.openParticipantsListDate,
                adminId: event.adminId,
                recurringDay: event.recurringDay as keyof typeof EdaysOfWeek | null,
                maxOfParticipantsWaitingList: event.maxOfParticipantsWaitingList,
                participants: event.participants.map((participant) => {
                    return Participant.with({
                        eventId: participant.eventId,
                        id: participant.id,
                        status: participant.status as ParticipantStatus,
                        participantName: participant.participantName,
                        userId: participant.userId,
                        createdAt: participant.createdAt
                    })
                })
            })

            return eventWith
        })

        return eventsList
    }

    public async findRecurringEventsByDay(day: keyof typeof EdaysOfWeek): Promise<Event[]> {
        const recurringEvents = await this.prismaClient.event.findMany({
            where: {
                recurringDay: day
            }
        })

        const eventsList = recurringEvents.map((event) => {
            const eventWith = Event.with({
                id: event.id,
                createdAt: event.createdAt,
                location: event.location,
                maxParticipants: event.maxParticipants,
                name: event.name,
                sportId: event.sportId,
                datetime: event.datetime,
                startTime: event.startTime,
                endTime: event.endTime,
                openParticipantsListDate: event.openParticipantsListDate,
                adminId: event.adminId,
                recurringDay: event.recurringDay as keyof typeof EdaysOfWeek | null,
                maxOfParticipantsWaitingList: event.maxOfParticipantsWaitingList,
                participants: []
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
                participants: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
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
            datetime: event.datetime,
            startTime: event.startTime,
            endTime: event.endTime,
            recurringDay: event.recurringDay as keyof typeof EdaysOfWeek | null,
            adminId: event.adminId,
            maxOfParticipantsWaitingList: event.maxOfParticipantsWaitingList,
            openParticipantsListDate: event.openParticipantsListDate,
            participants: event.participants.map((participant) => {
                return Participant.with({
                    eventId: participant.eventId,
                    id: participant.id,
                    status: participant.status as ParticipantStatus,
                    userId: participant.userId,
                    participantName: participant.participantName,
                    createdAt: participant.createdAt
                })
            })
        })

        return aEvent
    }

    public async update(event: Event): Promise<Event> {
        const {
            id,
            createdAt,
            location,
            maxParticipants,
            name,
            sportId,
            adminId,
            datetime,
            endTime,
            openParticipantsListDate,
            maxOfParticipantsWaitingList,
            startTime
        } = event

        const data = {
            createdAt,
            location,
            maxParticipants,
            name,
            sportId,
            adminId,
            datetime,
            endTime,
            maxOfParticipantsWaitingList,
            openParticipantsListDate,
            startTime
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
            datetime: event.datetime,
            sportId: getEvent!.sportId,
            startTime: getEvent!.startTime,
            endTime: getEvent!.endTime,
            openParticipantsListDate: getEvent!.openParticipantsListDate,
            adminId: getEvent!.adminId,
            recurringDay: getEvent!.recurringDay as keyof typeof EdaysOfWeek | null,
            maxOfParticipantsWaitingList: getEvent!.maxOfParticipantsWaitingList,
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
