import { EdaysOfWeek, type EventProps, Event } from '@domain/event/entity/event.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { Usecase } from '@usecases/usecase'
import cron from 'node-cron'

export type CreateEventInputDto = Omit<EventProps, 'id' | 'participants' | 'createdAt'>

export type CreateEventOutputDto = Omit<EventProps, 'participants'>

export class AutoCreateEventUsecase implements Usecase<void, void> {
    private constructor(private readonly eventGateway: EventGateway) {}

    public static create(eventGateway: EventGateway) {
        return new AutoCreateEventUsecase(eventGateway)
    }

    public async execute() {
        //? Execute every day at 00:00 PM
        const cronExpression = `0 0 * * Mon,Tue,Wed,Thu,Fri,Sat,Sun`
        cron.schedule(
            cronExpression,
            async () => {
                await this.createRecurringEventsForToday()
            },
            {
                scheduled: true,
                timezone: 'America/Sao_Paulo'
            }
        )
    }

    private async createRecurringEventsForToday() {
        const date = new Date()
        const weekDay = date.getDay()
        const dayName = EdaysOfWeek[weekDay] as keyof typeof EdaysOfWeek

        const eventsToRepeat = await this.eventGateway.findRecurringEventsByDay(dayName)
        console.log(eventsToRepeat)
        const map = this.mapEvents(eventsToRepeat)

        await this.eventGateway.saveMany(map)
    }

    private mapEvents(events: Event[]) {
        return events.map((event) => {
            const updateOpenParticipanrsLisKeepTime = this.updateDateKeepTime(
                event.openParticipantsListDate
            )

            const aEvent = Event.create(
                0,
                event.name,
                event.sportId,
                event.maxParticipants,
                event.location,
                new Date(),
                event.startTime,
                event.endTime,
                updateOpenParticipanrsLisKeepTime,
                event.maxOfParticipantsWaitingList,
                event.adminId,
                null
            )

            return aEvent
        })
    }

    private updateDateKeepTime(originalDateString: Date | null) {
        if (!originalDateString) return null

        const originalDate = new Date(originalDateString)
        const currentDate = new Date()

        // Extrai o horário da data original
        const hours = originalDate.getUTCHours()
        const minutes = originalDate.getUTCMinutes()
        const seconds = originalDate.getUTCSeconds()
        const milliseconds = originalDate.getUTCMilliseconds()

        // Define a data atual, mantendo o horário original
        currentDate.setUTCHours(hours, minutes, seconds, milliseconds)

        return currentDate
    }
}
