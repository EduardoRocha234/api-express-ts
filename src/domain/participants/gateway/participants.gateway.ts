import type { Participant } from "@prisma/client" 
import type { ParticipantStatus } from "../entity/participants.entity"

export interface ParticipantGateway {
    save(particpant: Participant): Promise<void>
    findByStatusAndEventId(eventId: number, status: ParticipantStatus): Promise<Participant[]>
    getCountParticipantsByStatusAndEventId(eventId: number, status: ParticipantStatus): Promise<number>
    // list(): Promise<Event[]>
    // findById(id: number): Promise<Event | undefined>
    // delete(id: number): Promise<void>
    // update(user: Event): Promise<Event>
}
