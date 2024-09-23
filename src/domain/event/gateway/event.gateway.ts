import type { EdaysOfWeek, Event } from "../entity/event.entity"

export interface EventGateway {
    save(event: Event): Promise<Event>
    list(): Promise<Event[]>
    findById(id: number): Promise<Event | undefined>
    delete(id: number): Promise<void>
    update(event: Event): Promise<Event>
    findRecurringEventsByDay(day: keyof typeof EdaysOfWeek): Promise<Event[]>
    saveMany(events: Event[]): Promise<void>
}
