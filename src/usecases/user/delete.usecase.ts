import type { UserGateway } from '@domain/user/gateway/user.gateway'
import type { Usecase } from '../usecase'

export type DeleteUserInputDto = string

export type DeleteUserOutputDto = {
    sucess: boolean
}

export class DeleteUserUsecase implements Usecase<DeleteUserInputDto, void> {
    private constructor(private readonly userGateway: UserGateway) {}

    public static create(userGateway: UserGateway) {
        return new DeleteUserUsecase(userGateway)
    }

    public async execute(id: string): Promise<void> {
        return await this.userGateway.delete(id)
    }
}
