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

export class FindUserByEmailUsecase implements Usecase<FindUserInputDto, FindUserOutputDto> {
    private constructor(private readonly userGateway: UserGateway) {}

    public static create(userGateway: UserGateway) {
        return new FindUserByEmailUsecase(userGateway)
    }

    public async execute(email: string): Promise<FindUserOutputDto> {
        const user = await this.userGateway.findByEmail(email)

        const output = this.presentOutput(user)

        return output
    }

    private presentOutput(user?: User): FindUserOutputDto {
        if (!user) return 

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password:  user.password
        }
    }
}
