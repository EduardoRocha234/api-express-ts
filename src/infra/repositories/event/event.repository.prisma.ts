import { PrismaClient } from '@prisma/client'
import type {
    EventGateway,
    ListEventInput,
    ListEventOutput
} from '@domain/event/gateway/event.gateway'
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
            maxOfParticipantsWaitingList,
            description
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
            openParticipantsListDate,
            description
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
            description: eventCreated.description,
            participants: []
        })

        return aEvent
    }

    public async saveMany(events: Event[]): Promise<void> {
        const data = events.map((event) => ({
            createdAt: event.createdAt,
            location: event.location,
            maxParticipants: event.maxParticipants,
            name: event.name,
            sportId: event.sportId,
            datetime: event.datetime,
            endTime: event.endTime,
            startTime: event.startTime,
            adminId: event.adminId,
            recurringDay: event.recurringDay as keyof typeof EdaysOfWeek | null,
            maxOfParticipantsWaitingList: event.maxOfParticipantsWaitingList,
            openParticipantsListDate: event.openParticipantsListDate
        }))

        await this.prismaClient.event.createMany({
            data
        })
    }

    public async list({
        page,
        pageSize,
        sportId,
        initialPeriod,
        finalPeriod,
        locale
    }: ListEventInput): Promise<ListEventOutput> {
        const skip = (page - 1) * pageSize
        const take = pageSize

        const events = await this.prismaClient.event.findMany({
            skip,
            take,
            where: {
                sportId: sportId,
                datetime: {
                    gte: initialPeriod, // Maior ou igual à data de início
                    lte: finalPeriod // Menor ou igual à data de término
                },
                location: {
                    contains: locale
                }
            },
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
                description: event.description,
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

        const totalRecords = await this.prismaClient.event.count()
        const totalPages = Math.ceil(totalRecords / pageSize)

        // Calcula o valor de nextPage e previousPage
        const nextPage = page < totalPages ? page + 1 : null
        const previousPage = page > 1 ? page - 1 : null

        // Verifica se a página atual é a última
        const isLastPage = page >= totalPages

        return {
            events: eventsList,
            metadata: {
                currentPage: page,
                totalPages,
                isLastPage,
                nextPage,
                previousPage
            }
        }
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
                description: event.description,
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
            description: event.description,
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
            startTime,
            description
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
            startTime,
            description
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
            description: getEvent!.description,
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
