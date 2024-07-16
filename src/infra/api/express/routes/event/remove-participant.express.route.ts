import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { DeleteUserUsecase } from '@usecases/user/delete.usecase'
import type { FindUserByIdUsecase } from '@usecases/user/find-by-id.usecase'
import type { DeleteParticipant } from '@usecases/participant/delete.usecase'
import type { FindParticipantByIdUseCase } from '@usecases/participant/find-by-id.usecase'
import type { FindEventByIdUsecase } from '@usecases/event/find-by-id.usecase'
import { ParticipantStatusEnum } from '@domain/participants/entity/participants.entity'
import type { CountOfParticipantByEventIdAndStatusUsecase } from '@usecases/participant/count-by-eventId-and-status.usecase'
import type { FindParticipantsByEventIdAndStatusUsecase } from '@usecases/participant/find-by-event-and-status.usecase'

export type DeleteUserResponseDto = {
    message: string
}

export class DeleteParticipantOfEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly eventService: FindEventByIdUsecase,
        private readonly getParticipantsService: FindParticipantsByEventIdAndStatusUsecase,
        private readonly deleteParticipantService: DeleteParticipant,
        private readonly findParticipantService: FindParticipantByIdUseCase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        eventService: FindEventByIdUsecase,
        getParticipantsService: FindParticipantsByEventIdAndStatusUsecase,
        deleteParticipantService: DeleteParticipant,
        findParticipantService: FindParticipantByIdUseCase,
        middlewares: Middlewares
    ) {
        return new DeleteParticipantOfEventRoute(
            '/event/:eventId/remove/:userId',
            HttpMethod.DELETE,
            eventService,
            getParticipantsService,
            deleteParticipantService,
            findParticipantService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const eventId = Number(request.params['eventId'])
            const userId = String(request.params['userId'])

            const findEvent = await this.eventService.execute(eventId)

            if (!findEvent) {
                response.status(404).json({ message: 'Evento não encontrado' }).send()
                return
            }

            const findParticipant = await this.findParticipantService.execute(userId)

            if (!findParticipant) {
                response.status(404).json({ message: 'Participante não encontrado' }).send()
                return
            }

            try {
                await this.deleteParticipantService.execute(findParticipant.id)

                const participantsWaitingList = await this.getParticipantsService.execute({
                    eventId,
                    status: ParticipantStatusEnum.WATING_LIST
                })

                if (participantsWaitingList.length > 0) {
                    const firstParticipantWatingList = participantsWaitingList[0]

                    await this.changeStatusOfParticipantService.execute({
                        id: firstParticipantWatingList.id,
                        status: ParticipantStatusEnum.CONFIRMED
                    })
                }

                response
                    .status(200)
                    .json({
                        message: 'Participante removido do evento com sucesso'
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

    public getMiddlewares() {
        return this.middlewares
    }

    private present(input: string): DeleteUserResponseDto {
        const response = {
            message: input
        }

        return response
    }
}
