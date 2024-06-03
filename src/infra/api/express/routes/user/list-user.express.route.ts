import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { ListUserOutputDto, ListUserUsecase } from '@usecases/user/list-user.usecase'

export type ListUserResponseDto = {
    users: {
        id: string
        name: string
        email: string
    }[]
}

export class ListUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listUserService: ListUserUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(listUserService: ListUserUsecase, middlewares: Middlewares) {
        return new ListUserRoute('/user', HttpMethod.GET, listUserService, middlewares)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const output = await this.listUserService.execute()

            const responseBody = this.present(output)

            response.status(200).json(responseBody).send()
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

    private present(input: ListUserOutputDto): ListUserResponseDto {
        const response: ListUserResponseDto = {
            users: input.users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email
            }))
        }

        return response
    }
}
