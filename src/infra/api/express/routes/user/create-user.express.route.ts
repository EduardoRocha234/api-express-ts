import type { Request, Response } from 'express'
import type { CreateUserInputDto, CreateUserUsecase } from '@usecases/user/create-user.usecase'
import { HttpMethod, type Middlewares, type Route } from '../routes'
import type { FindUserByEmailUsecase } from '@usecases/user/find-by-email.usecase'

export type CreateUserResponseDto = {
    id: string
    name: string
    email: string
}

export class CreateUserRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly CreateUserService: CreateUserUsecase,
        private readonly findUserService: FindUserByEmailUsecase
    ) {}

    public static create(
        createUserService: CreateUserUsecase,
        findUserService: FindUserByEmailUsecase
    ) {
        return new CreateUserRoute('/user', HttpMethod.POST, createUserService, findUserService)
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { name, email, password } = request.body

            const verifyUserExist = await this.findUserService.execute(email)

            if(verifyUserExist) {
                response
                   .status(409)
                   .json({
                        message: 'Usuário já existe'
                    })
                   .send()
                return
            }

            const input: CreateUserInputDto = {
                email,
                name,
                password
            }

            const output: CreateUserResponseDto = await this.CreateUserService.execute(input)

            const responseBody = this.present(output)

            response.status(201).json(responseBody).send()
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

    private present(input: CreateUserResponseDto): CreateUserResponseDto {
        const response = {
            id: input.id,
            name: input.name,
            email: input.email
        }

        return response
    }
}
