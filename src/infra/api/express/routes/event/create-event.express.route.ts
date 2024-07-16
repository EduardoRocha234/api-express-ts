import type { Request, Response } from 'express'
import type { CreateUserInputDto, CreateUserUsecase } from '@usecases/user/create-user.usecase'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { CreateEventInputDto, CreateEventUsecase } from '@usecases/event/create.usecase'

export type CreateEventResponseDto = {
    id: number
    name: string
    sportId: number
    maxParticipants: number
    createdAt: Date
    location: string
}

export class CreateEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createEventService: CreateEventUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(createEventService: CreateEventUsecase, middlewares: Middlewares) {
        return new CreateEventRoute('/event', HttpMethod.POST, createEventService, middlewares)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { name, sportId, maxParticipants, location } = request.body

            const input: CreateEventInputDto = {
                location,
                maxParticipants,
                name,
                sportId
            }

            const output: CreateEventResponseDto = await this.createEventService.execute(input)

            const responseBody = this.present(output)

            response.status(201).json(responseBody).send()
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

    private present(input: CreateEventResponseDto): CreateEventResponseDto {
        const response: CreateEventResponseDto = {
            id: input.id,
            createdAt: input.createdAt,
            location: input.location,
            maxParticipants: input.maxParticipants,
            name: input.name,
            sportId: input.sportId
        }

        return response
    }
}
