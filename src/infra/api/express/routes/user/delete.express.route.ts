import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { DeleteUserUsecase } from '@usecases/user/delete.usecase'
import type { FindUserByIdUsecase } from '@usecases/user/find-by-id.usecase'
import { AuthMiddleware } from '../../middlewares/auth.middleware'

export type DeleteUserResponseDto = {
    message: string
}

export class DeleteUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteUserService: DeleteUserUsecase,
        private readonly findUserService: FindUserByIdUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(
        deleteUserService: DeleteUserUsecase,
        findUserService: FindUserByIdUsecase,
        middlewares: Middlewares
    ) {
        return new DeleteUserRoute(
            '/user/:id',
            HttpMethod.DELETE,
            deleteUserService,
            findUserService,
            middlewares
        )
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const id = request.params['id']

            const user = await this.findUserService.execute(id)

            if (!user) {
                response.status(404).json({ message: 'Usuário não encontrado' }).send()
                return
            }

            try {
                await this.deleteUserService.execute(id)
                const responseBody = this.present('Usuário deletado com sucesso')

                response.status(200).json(responseBody).send()
            } catch (error) {
                response.status(500).send()
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
