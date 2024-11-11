import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type {
    GetUsersWantNotificationsByEventIdAndUserIdUseCase,
    GetUsersWantsNotificationsByEventAndUserIdInputDto,
    GetUsersWantsNotificationsByEventAndUserIdOutputDto
} from '@usecases/eventNotificationsUsers/get-by-event-id-and-user-id.usecase'
import type { EventNotificationsUsers } from '@domain/eventNotificationsUsers/entity/event-notifications-users.entity'

export type GetUsersWantNotificationsByEventIdAndUserIdResponseDto = Omit<
    EventNotificationsUsers,
    'userPushToken'
> | null

export class GetUsersWantNotificationsByEventIdAndUserIdRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly notificationService: GetUsersWantNotificationsByEventIdAndUserIdUseCase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        notificationService: GetUsersWantNotificationsByEventIdAndUserIdUseCase,
        middlewares: Middlewares
    ) {
        return new GetUsersWantNotificationsByEventIdAndUserIdRoute(
            '/user-has-nofification-config',
            HttpMethod.GET,
            notificationService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { eventId, userId } =
                request.query as unknown as GetUsersWantsNotificationsByEventAndUserIdInputDto

            if (!eventId || !userId) {
                response
                    .status(404)
                    .json({
                        message: 'Usuário não permitiu notificacões para este evento'
                    })
                    .send()
                return
            }

            try {
                const output = await this.notificationService.execute({
                    eventId: Number(eventId),
                    userId
                })

                if (!output)
                    response
                        .status(404)
                        .json({
                            message: 'Usuário não permitiu notificacões para este evento'
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

    private present(
        input: GetUsersWantsNotificationsByEventAndUserIdOutputDto
    ): GetUsersWantNotificationsByEventIdAndUserIdResponseDto {
        if (!input) return null

        const response = {
            eventId: input.eventId,
            id: input.id,
            userId: input.userId
        } satisfies GetUsersWantNotificationsByEventIdAndUserIdResponseDto

        return response
    }
}
