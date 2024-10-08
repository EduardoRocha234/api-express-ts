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
    findByUserIdAndEventId(userId: string, eventId: number): Promise<Participant | undefined>
    delete(id: number): Promise<void>
    changeStatusOfParticipant(id: number, status: ParticipantStatus): Promise<void>
    findParticipantsOfEvent(eventId: number): Promise<Participant[]>
    // update(user: Event): Promise<Event>
}
