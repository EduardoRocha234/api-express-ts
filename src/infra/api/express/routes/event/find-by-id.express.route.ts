import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import { type ParticipantStatus } from '@domain/participants/entity/participants.entity'
import type { FindEventByIdUsecase, FindEventOutputDto } from '@usecases/event/find-by-id.usecase'

export type FindEventByIdResponseDto = {
    id: number
    name: string
    sportId: number
    maxParticipants: number
    createdAt: Date
    datetime: Date
    location: string
    participants: {
        id: number
        userId: string
        status: ParticipantStatus
    }[]
}

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

            const output = await this.findEventService.execute(id)

            if (!output) response.status(404).json({}).send()

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

    private present(input: FindEventOutputDto): FindEventByIdResponseDto {
        const response: FindEventOutputDto = {
            id: input!.id,
            name: input!.name,
            sportId: input!.sportId,
            maxParticipants: input!.maxParticipants,
            location: input!.location,
            createdAt: input!.createdAt,
            datetime: input!.datetime,
            participants: input!.participants.map((participant) => ({
                id: participant.id,
                userId: participant.userId,
                participantName: participant.participantName,
                status: participant.status,
                createdAt: participant.createdAt,
            }))
        }

        return response
    }
}
