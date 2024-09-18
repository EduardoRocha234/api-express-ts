import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { ListSportsUseCase } from '@usecases/sport/list.usecase'

export class ListSportsRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listSportsUseCase: ListSportsUseCase,
        private readonly middlewares: Middlewares
    ) {}

    public static create(listSportsUseCase: ListSportsUseCase, middlewares: Middlewares) {
        return new ListSportsRoute('/sport', HttpMethod.GET, listSportsUseCase, middlewares)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const output = await this.listSportsUseCase.execute()

                response.status(200).json(output).send()
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
