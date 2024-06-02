import type { User } from '@domain/user/entity/user'
import type { UserGateway } from '@domain/user/gateway/user.gateway'
import type { Usecase } from '../usecase'

export type FindUserInputDto = string

export type FindUserOutputDto = {
    id: string
    name: string
    email: string
    password: string
} | undefined

export class FindUserByIdUsecase implements Usecase<FindUserInputDto, FindUserOutputDto> {
    private constructor(private readonly userGateway: UserGateway) {}

    public static create(userGateway: UserGateway) {
        return new FindUserByIdUsecase(userGateway)
    }

    public async execute(id: string): Promise<FindUserOutputDto> {
        const user = await this.userGateway.findById(id)

        const output = this.presentOutput(user)

        return output
    }

    private presentOutput(user?: User): FindUserOutputDto {
        if (!user) return

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        }
    }
}
