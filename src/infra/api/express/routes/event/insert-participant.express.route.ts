import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type {
    InserParticipantUsecase,
    InsertParticipantInputDto
} from '@usecases/participant/create.usecase'
import type { FindEventByIdUsecase } from '@usecases/event/find-by-id.usecase'
import { ParticipantStatusEnum } from '@domain/participants/entity/participants.entity'
import type { Server as SocketIOServer } from 'socket.io'
import type { FindParticipantsByEventIdUsecase } from '@usecases/participant/find-by-eventid.usecase'
import type { FindParticipantByIdUseCase } from '@usecases/participant/find-by-id.usecase'

export class InsertParticipantInEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly eventService: FindEventByIdUsecase,
        private readonly getParticipants: FindParticipantsByEventIdUsecase,
        private readonly insertParticipantService: InserParticipantUsecase,
        private readonly findParticipantService: FindParticipantByIdUseCase,
        private readonly io: SocketIOServer,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        eventService: FindEventByIdUsecase,
        getParticipants: FindParticipantsByEventIdUsecase,
        insertParticipantService: InserParticipantUsecase,
        findParticipantService: FindParticipantByIdUseCase,
        io: SocketIOServer,
        middlewares: Middlewares
    ) {
        return new InsertParticipantInEventRoute(
            '/event/:eventId/join/:userId',
            HttpMethod.POST,
            eventService,
            getParticipants,
            insertParticipantService,
            findParticipantService,
            io,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const userId = String(request.params['userId'])
            const eventId = Number(request.params['eventId'])

            try {
                const findEvent = await this.eventService.execute(eventId)

                if (!findEvent) {
                    response.status(404).json({ message: 'Evento não encontrado' }).send()
                    return
                }

                const participants = await this.getParticipants.execute({
                    eventId
                })

                if (participants.length === findEvent.maxParticipants) {
                    response.status(409).json({ message: 'O evento já está cheio' }).send()
                    return
                }

                const numbersOfParticipantsConfirmed = participants.filter(
                    (p) => p.status === ParticipantStatusEnum.CONFIRMED
                ).length

                const maxNumberOfParticipantsConfirmed =
                    findEvent.maxParticipants - findEvent.maxOfParticipantsWaitingList

                const status =
                    numbersOfParticipantsConfirmed < maxNumberOfParticipantsConfirmed
                        ? ParticipantStatusEnum.CONFIRMED
                        : ParticipantStatusEnum.WATING_LIST

                const input: InsertParticipantInputDto = {
                    eventId,
                    status,
                    userId
                }

                await this.insertParticipantService.execute(input)

                const findParticipant = await this.findParticipantService.execute({
                    eventId,
                    userId
                })

                this.io.emit('insertParticipant', {
                    eventId: input.eventId,
                    participant: findParticipant,
                    status: input.status
                })

                response
                    .status(201)
                    .json({
                        message: 'Participante adicionado ao evento com sucesso'
                    })
                    .send()
            } catch (error) {
                console.error(error)
                response
                    .status(500)
                    .json({
                        message:
                            'Ocorreu um erro interno ao tentar adicionar o participante no evento: ' +
                            error
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
}
