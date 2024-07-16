import type { Participant, ParticipantStatus } from '../entity/participants.entity'

export interface ParticipantGateway {
    save(particpant: Participant): Promise<void>
    findByStatusAndEventId(eventId: number, status: ParticipantStatus): Promise<Participant[]>
    getCountParticipantsByStatusAndEventId(
        eventId: number,
        status: ParticipantStatus
    ): Promise<number>
    // list(): Promise<Event[]>
    findById(id: number): Promise<Participant | undefined>
    findByUserId(userId: string): Promise<Participant | undefined>
    delete(id: number): Promise<void>
    // update(user: Event): Promise<Event>
}
