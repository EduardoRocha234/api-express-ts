import type { Request, Response } from 'express'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { FindUserByEmailUsecase } from '@usecases/user/find-by-email.usecase'
import type { BcryptAdapter } from '@infra/driven-adapter/bcrypt-adapter'
import type { JwtAdapter } from '@infra/driven-adapter/jwt-adapter'

export type LoginResponseDto = {
    token: string
}

export class LoginRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findUserService: FindUserByEmailUsecase,
        private readonly jwtAdapter: JwtAdapter,
        private readonly bcryptAdapter: BcryptAdapter
    ) {}

    public static create(
        findUserService: FindUserByEmailUsecase,
        jwtAdapter: JwtAdapter,
        bcryptAdapter: BcryptAdapter
    ) {
        return new LoginRoute('/login', HttpMethod.POST, findUserService, jwtAdapter, bcryptAdapter)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { email, password } = request.body

            if (!email || !password) {
                response
                    .status(401)
                    .json({
                        message: 'Crendenciais inválidas'
                    })
                    .send()
                return
            }

            const findUser = await this.findUserService.execute(email)

            if (!findUser) {
                response
                    .status(404)
                    .json({
                        message: 'Usuário não encontrado'
                    })
                    .send()
                return
            }

            const compareResult = await this.bcryptAdapter.compare(password, findUser.password)

            if (compareResult) {
                const token = await this.jwtAdapter.encrypt(
                    JSON.stringify({ email, name: findUser.name })
                )

                const responseBody = this.present(token)

                response.status(200).json(responseBody).send()
                return
            }

            response.status(401).json({ message: 'Crendenciais inválidas' }).send()
        }
    }

    public getPath(): string {
        return this.path
    }

    public getMethod(): HttpMethod {
        return this.method
    }

    public getMiddlewares(): Middlewares {
        return []
    }

    private present(input: string): LoginResponseDto {
        const response: LoginResponseDto = {
            token: input
        }

        return response
    }
}
