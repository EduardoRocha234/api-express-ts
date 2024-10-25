import type { Usecase } from '../usecase'
import type { FirebaseAdminService } from '@package/firebase/fire-base-admin'

export type NotifyPartipantInputDto = {
    eventId: number
    // userId: string
    token: string
}

export class NotifyParticipantListOpening implements Usecase<NotifyPartipantInputDto, void> {
    private constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

    public static create(firebaseAdminService: FirebaseAdminService) {
        return new NotifyParticipantListOpening(firebaseAdminService)
    }

    public async execute({ eventId, token }: NotifyPartipantInputDto): Promise<void> {
        return await this.firebaseAdminService.sendNotification(token, {
            title: 'A lista de participantes está aberta!',
            body: `A lista de participantes para o evento ${eventId} está aberta.`
        })
    }
}
