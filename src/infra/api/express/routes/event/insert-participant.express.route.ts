import type { Request, Response } from 'express'
import type { CreateUserInputDto, CreateUserUsecase } from '@usecases/user/create-user.usecase'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { CreateEventInputDto, CreateEventUsecase } from '@usecases/event/create.usecase'
import type {
    InserParticipantUsecase,
    InsertParticipantInputDto
} from '@usecases/participant/create.usecase'
import type { FindEventByIdUsecase } from '@usecases/event/find-by-id.usecase'
import type { CountOfParticipantByEventIdAndStatusUsecase } from '@usecases/participant/find-by-eventId-and-status.usecase'
import { ParticipantStatusEnum } from '@domain/participants/entity/participants.entity'

// export type InsertParticpantResponse = {
//     id: number
//     name: string
//     sportId: number
//     maxParticipants: number
//     dateTime: Date
//     location: string
// }

export class InsertParticipantInEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly eventService: FindEventByIdUsecase,
        private readonly getCountOfParticipants: CountOfParticipantByEventIdAndStatusUsecase,
        private readonly insertParticipantService: InserParticipantUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        eventService: FindEventByIdUsecase,
        getCountOfParticipants: CountOfParticipantByEventIdAndStatusUsecase,
        insertParticipantService: InserParticipantUsecase,
        middlewares: Middlewares
    ) {
        return new InsertParticipantInEventRoute(
            '/event/:eventId/join',
            HttpMethod.POST,
            eventService,
            getCountOfParticipants,
            insertParticipantService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { userId } = request.body
            const eventId = Number(request.params['eventId'])
            const findEvent = await this.eventService.execute(eventId)

            if (!findEvent) {
                response.status(404).json({ message: 'Evento não encontrado' }).send()
                return
            }

            try {
                const participantsCount = await this.getCountOfParticipants.execute({
                    eventId,
                    status: ParticipantStatusEnum.CONFIRMED
                })

                const status =
                    participantsCount < findEvent.maxParticipants
                        ? ParticipantStatusEnum.CONFIRMED
                        : ParticipantStatusEnum.WATING_LIST

                const input: InsertParticipantInputDto = {
                    eventId,
                    status,
                    userId
                }

                await this.insertParticipantService.execute(input)

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
}
