import type { UserGateway } from '@domain/user/gateway/user.gateway'
import type { Usecase } from '../usecase'

export type SaveUserPushTokenInputDto = {
    userId: string
    token: string
}

export class SaveUserPushTokenUseCase implements Usecase<SaveUserPushTokenInputDto, void> {
    private constructor(private readonly userGateway: UserGateway) {}

    public static create(userGateway: UserGateway) {
        return new SaveUserPushTokenUseCase(userGateway)
    }

    public async execute({ userId, token }: SaveUserPushTokenInputDto): Promise<void> {
        return await this.userGateway.savePushToken(userId, token)
    }
}
