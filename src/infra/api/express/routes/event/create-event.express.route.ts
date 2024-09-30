import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { CreateEventInputDto, CreateEventUsecase } from '@usecases/event/create.usecase'
import type { EventProps } from '@domain/event/entity/event.entity'

export type CreateEventResponseDto = Omit<EventProps, 'participants' | 'recurringDay'>

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
            const {
                name,
                sportId,
                maxParticipants,
                location,
                datetime,
                startTime,
                endTime,
                adminId,
                maxOfParticipantsWaitingList,
                openParticipantsListDate,
                recurringDay,
                description
            } = request.body as CreateEventInputDto

            if (
                !name ||
                !sportId ||
                !maxParticipants ||
                !location ||
                !startTime ||
                !adminId ||
                !endTime ||
                !adminId
            ) {
                response
                    .status(400)
                    .json({
                        message: 'Dados inválidos'
                    })
                    .send()
                return
            }

            try {
                const input: CreateEventInputDto = {
                    location,
                    datetime,
                    maxParticipants,
                    name,
                    startTime,
                    endTime,
                    sportId,
                    adminId,
                    maxOfParticipantsWaitingList,
                    openParticipantsListDate,
                    recurringDay,
                    description
                }

                const output: CreateEventResponseDto = await this.createEventService.execute(input)

                const responseBody = this.present(output)

                response.status(201).json(responseBody).send()
            } catch (error) {
                console.error(error)
                response
                    .status(500)
                    .json({
                        message: 'Ocorreu um erro interno ao tentar criar o evento: ' + error
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

    private present(input: CreateEventResponseDto): CreateEventResponseDto {
        const response: CreateEventResponseDto = {
            id: input.id,
            createdAt: input.createdAt,
            location: input.location,
            maxParticipants: input.maxParticipants,
            name: input.name,
            datetime: input.datetime,
            endTime: input.endTime,
            startTime: input.startTime,
            sportId: input.sportId,
            maxOfParticipantsWaitingList: input.maxOfParticipantsWaitingList,
            openParticipantsListDate: input.openParticipantsListDate,
            adminId: input.adminId,
            description: input.description
        }

        return response
    }
}
