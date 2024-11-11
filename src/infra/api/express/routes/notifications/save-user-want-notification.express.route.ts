import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type {
    SaveUserWantsNotificationInputDto,
    SaveUserWantsNotificatioUseCase
} from '@usecases/eventNotificationsUsers/save-user-want-notication.usecase'
import type { FindUserByIdUsecase } from '@usecases/user/find-by-id.usecase'

export class SaveUserWantsNotificationRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly SaveUserWantsNotificationService: SaveUserWantsNotificatioUseCase,
        private readonly userService: FindUserByIdUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        saveUserWantsNotificationService: SaveUserWantsNotificatioUseCase,
        userService: FindUserByIdUsecase,
        middlewares: Middlewares
    ) {
        return new SaveUserWantsNotificationRoute(
            '/save-user-event-notification',
            HttpMethod.POST,
            saveUserWantsNotificationService,
            userService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { eventId, userId } = request.body as SaveUserWantsNotificationInputDto

            try {
                console.log(userId)
                const user = await this.userService.execute(userId)

                if (!user) {
                    response
                        .status(404)
                        .json({
                            message: 'Usuário não encontrado'
                        })
                        .send()
                    return
                }

                if (!user.pushToken) {
                    response
                        .status(401)
                        .json({
                            message: 'Usuário não possui token de notificação'
                        })
                        .send()
                    return
                }

                const data: SaveUserWantsNotificationInputDto = {
                    eventId,
                    userId,
                    userPushToken: user.pushToken as string | null
                }

                await this.SaveUserWantsNotificationService.execute(data)

                response
                    .status(201)
                    .json({
                        message:
                            'Você irá recever notifações sempre que a lista desse evento abrir!'
                    })
                    .send()
            } catch (error) {
                console.error(error)
                response
                    .status(500)
                    .json({
                        message: 'Ocorreu um erro interno',
                        error
                    })
                    .send()
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
