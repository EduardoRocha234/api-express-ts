import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { Participant } from '@domain/participants/entity/participants.entity'
import type { ListEventsOutputDto, ListEventUseCase } from '@usecases/event/list.usecase'
import type { EventProps } from '@domain/event/entity/event.entity'
import type { PaginationOutput } from '@domain/shared/pagination.interface'
import type { ListEventInput } from '@domain/event/gateway/event.gateway'

export type ListEventResponseDto = {
    events: Omit<EventProps, 'description'>[]
    metadata: PaginationOutput
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
            const { page, pageSize, sportId, initialPeriod, finalPeriod, locale } =
                request.query as unknown as ListEventInput

            try {
                const output = await this.listEventService.execute({
                    page: Number(page) || 1,
                    pageSize: Number(pageSize) || 10,
                    sportId: sportId ? Number(sportId) : undefined,
                    initialPeriod: initialPeriod ? new Date(initialPeriod) : undefined,
                    finalPeriod: finalPeriod ? new Date(finalPeriod) : undefined,
                    locale
                })

                const responseBody = this.present(output)

                response.status(200).json(responseBody).send()
            } catch (error) {
                console.error(error)
                response
                    .status(500)
                    .json({
                        message: 'Ocorreu um erro interno: ' + error
                    })
                    .send()
                return
            }
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
                openParticipantsListDate: event.openParticipantsListDate,
                maxOfParticipantsWaitingList: event.maxOfParticipantsWaitingList,
                adminId: event.adminId,
                recurringDay: event.recurringDay,
                participants: event.participants.map((participant) => ({
                    id: participant.id,
                    userId: participant.userId,
                    participantName: participant.participantName,
                    status: participant.status,
                    createdAt: participant.createdAt
                })) as Participant[]
            })),
            metadata: input.metadata
        }

        return response
    }
}
