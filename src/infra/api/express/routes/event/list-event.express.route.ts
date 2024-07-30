import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { ParticipantStatus } from '@domain/participants/entity/participants.entity'
import type { ListEventsOutputDto, ListEventUseCase } from '@usecases/event/list.usecase'

export type ListEventResponseDto = {
    events: {
        id: number
        name: string
        sportId: number
        maxParticipants: number
        createdAt: Date
        datetime: Date
        startTime: Date
        endTime: Date
        location: string
        participants: {
            id: number
            userId: string
            participantName?: string
            status: ParticipantStatus
            createdAt: Date
        }[]
    }[]
}

export class ListEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listEventService: ListEventUseCase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(listEventService: ListEventUseCase, middlewares: Middlewares) {
        return new ListEventRoute('/event', HttpMethod.GET, listEventService, middlewares)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const output = await this.listEventService.execute()

            const responseBody = this.present(output)

            response.status(200).json(responseBody).send()
        }
    }

    public getPath(): string {
        return this.path
    }

    public getMethod(): HttpMethod {
        return this.method
    }

    public getMiddlewares(): Middlewares {
        return this.middlewares
    }

    private present(input: ListEventsOutputDto): ListEventResponseDto {
        const response: ListEventResponseDto = {
            events: input.events.map((event) => ({
                id: event.id,
                name: event.name,
                sportId: event.sportId,
                maxParticipants: event.maxParticipants,
                createdAt: event.createdAt,
                location: event.location,
                datetime: event.datetime,
                startTime: event.startTime,
                endTime: event.endTime,
                participants: event.participants.map((participant) => ({
                    id: participant.id,
                    userId: participant.userId,
                    participantName: participant.participantName,
                    status: participant.status,
                    createdAt: participant.createdAt
                }))
            }))
        }

        return response
    }
}
