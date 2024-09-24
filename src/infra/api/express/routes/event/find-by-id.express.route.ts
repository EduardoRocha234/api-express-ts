import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import { Participant } from '@domain/participants/entity/participants.entity'
import type { FindEventByIdUsecase, FindEventOutputDto } from '@usecases/event/find-by-id.usecase'
import type { EventProps } from '@domain/event/entity/event.entity'

export type FindEventByIdResponseDto = EventProps

export class FindEventByIdRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findEventService: FindEventByIdUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(findEventService: FindEventByIdUsecase, middlewares: Middlewares) {
        return new FindEventByIdRoute('/event/:id', HttpMethod.GET, findEventService, middlewares)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const id = Number(request.params['id'])

            try {
                const output = await this.findEventService.execute(id)

                if (!output)
                    response
                        .status(404)
                        .json({
                            message: 'Evento não encontrado'
                        })
                        .send()

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

    private present(input: FindEventOutputDto): FindEventByIdResponseDto | null {
        if (!input) return null

        const response: FindEventOutputDto = {
            id: input!.id,
            name: input!.name,
            sportId: input!.sportId,
            maxParticipants: input!.maxParticipants,
            location: input!.location,
            createdAt: input!.createdAt,
            datetime: input!.datetime,
            endTime: input!.endTime,
            startTime: input!.startTime,
            adminId: input!.adminId,
            maxOfParticipantsWaitingList: input!.maxOfParticipantsWaitingList,
            openParticipantsListDate: input!.openParticipantsListDate,
            recurringDay: input!.recurringDay,
            participants: input!.participants.map((participant) => ({
                id: participant.id,
                userId: participant.userId,
                participantName: participant.participantName,
                status: participant.status,
                createdAt: participant.createdAt
            })) as Participant[]
        }

        return response
    }
}
