import type { User } from '@domain/user/entity/user'
import type { UserGateway } from '@domain/user/gateway/user.gateway'
import type { Usecase } from '../usecase'

export type ListUserOutputDto = {
    users: {
        id: string
        name: string
        email: string
    }[]
}

export class ListUserUsecase implements Usecase<void, ListUserOutputDto> {
    private constructor(private readonly userGateway: UserGateway) {}

    public static create(userGateway: UserGateway) {
        return new ListUserUsecase(userGateway)
    }

    public async execute(): Promise<ListUserOutputDto> {
        const users = await this.userGateway.list()

        const output = this.presentOutput(users)

        return output
    }

    private presentOutput(users: User[]): ListUserOutputDto {
        return {
            users: users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email
            }))
        }
    }
}
