import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { SaveUserPushTokenUseCase } from '@usecases/user/save-push-token.usecase'
// import { FirebaseAdminService } from '@package/firebase/fire-base-admin'

export class SaveUserPushToken implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly savePushTokenService: SaveUserPushTokenUseCase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(savePushTokenService: SaveUserPushTokenUseCase, middlewares: Middlewares) {
        return new SaveUserPushToken(
            '/save-push-token',
            HttpMethod.POST,
            savePushTokenService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { userId, token } = request.body

            try {
                await this.savePushTokenService.execute({ userId, token })
                // const teste =  FirebaseAdminService.cr
                // const firebaseService = FirebaseAdminService.initFireBaseService()
                // console.log('aqui')

                // setTimeout(() => {
                //     firebaseService.sendNotification(token, {
                //         title: 'Novo Participante',
                //         body: 'Novo participante na sua lista de espera'
                //     })
                // }, 10000)

                response.status(200).send('Token saved successfully')
            } catch (error) {
                console.error(error)
                response
                    .status(500)
                    .json({
                        message: 'Ocorreu um erro interno ao tentar salvar o token: ' + error
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
