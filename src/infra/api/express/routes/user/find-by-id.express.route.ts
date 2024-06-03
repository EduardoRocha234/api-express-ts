import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { FindUserOutputDto, FindUserByIdUsecase } from '@usecases/user/find-by-id.usecase'

export type FindUserResponseDto = {
    id: string
    name: string
    email: string
}

export class FindUserByIdRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findUserService: FindUserByIdUsecase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(findUserService: FindUserByIdUsecase, middlewares: Middlewares) {
        return new FindUserByIdRoute('/user/:id', HttpMethod.GET, findUserService, middlewares)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const id = request.params['id']

            const output = await this.findUserService.execute(id)

            if (!output) response.status(404).json({}).send()

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

    private present(input: FindUserOutputDto): FindUserResponseDto {
        const response: FindUserOutputDto = {
            id: input!.id,
            email: input!.email,
            name: input!.name,
            password: input!.password
        }

        return response
    }
}
