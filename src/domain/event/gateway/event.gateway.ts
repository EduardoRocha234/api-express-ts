import type { PaginationInput, PaginationOutput } from '@domain/shared/pagination.interface'
import type { EdaysOfWeek, Event } from '../entity/event.entity'

export interface ListEventOutput {
    events: Event[]
    metadata: PaginationOutput
}

export interface EventGateway {
    save(event: Event): Promise<Event>
    list(props: PaginationInput): Promise<ListEventOutput>
    findById(id: number): Promise<Event | undefined>
    delete(id: number): Promise<void>
    update(event: Event): Promise<Event>
    findRecurringEventsByDay(day: keyof typeof EdaysOfWeek): Promise<Event[]>
    saveMany(events: Event[]): Promise<void>
}
