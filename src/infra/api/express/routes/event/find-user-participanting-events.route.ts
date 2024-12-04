import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import { Participant } from '@domain/participants/entity/participants.entity'
import type { EventProps } from '@domain/event/entity/event.entity'
import type {
    ListEventByUserParticipantingsOutputDto,
    ListUserParticipantsEventsUseCase
} from '@usecases/event/find-user-participanting-events'

export type ListUserParticipantsEventsResponseDto = {
    events: Omit<EventProps, 'description'>[]
}

export class ListUserParticipantsEventsRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findEventByUserParticipantingService: ListUserParticipantsEventsUseCase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        findEventByUserParticipantingService: ListUserParticipantsEventsUseCase,
        middlewares: Middlewares
    ) {
        return new ListUserParticipantsEventsRoute(
            '/events-by-user/:userId',
            HttpMethod.GET,
            findEventByUserParticipantingService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const userId = String(request.params['userId'])

            try {
                const output = await this.findEventByUserParticipantingService.execute({ userId })

                const responseBody = this.present(output)

                response.status(200).json(responseBody).send()
            } catch (error) {
                console.error(error)
                response
                    .status(500)
                    .json({
                        message: 'Ocorreu um erro interno  ' + error
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

    private present(
        input: ListEventByUserParticipantingsOutputDto
    ): ListUserParticipantsEventsResponseDto {
        const response: ListUserParticipantsEventsResponseDto = {
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
                daysBeforeOpeningList: event.daysBeforeOpeningList,
                latitude: event.latitude,
                longitude: event.longitude,
                participants: event.participants.map((participant) => ({
                    id: participant.id,
                    userId: participant.userId,
                    participantName: participant.participantName,
                    status: participant.status,
                    createdAt: participant.createdAt
                })) as Participant[]
            }))
        }

        return response
    }
}
