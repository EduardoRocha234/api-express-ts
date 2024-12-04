import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { DeleteUserEventNotificationUsecase } from '@usecases/eventNotificationsUsers/delete.usecase'

export type DeleteUserResponseDto = {
    message: string
}

export class DisableNotificationEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteService: DeleteUserEventNotificationUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        deleteService: DeleteUserEventNotificationUsecase,
        middlewares: Middlewares
    ) {
        return new DisableNotificationEventRoute(
            '/disable-event-notification/:userId/:eventId',
            HttpMethod.DELETE,
            deleteService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const userId = String(request.params['userId'])
            const eventId = Number(request.params['eventId'])

            try {
                await this.deleteService.execute({ eventId, userId })

                response.status(200).send()
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
