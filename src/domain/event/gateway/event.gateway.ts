import type { Event } from "../entity/event.entity"

export interface EventGateway {
    save(event: Event): Promise<Event>
    list(): Promise<Event[]>
    findById(id: number): Promise<Event | undefined>
    delete(id: number): Promise<void>
    update(event: Event): Promise<Event>
}
