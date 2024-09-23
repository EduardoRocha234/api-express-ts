import { EdaysOfWeek, type EventProps } from '@domain/event/entity/event.entity'
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
                console.log('teste')
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

        await this.eventGateway.saveMany(eventsToRepeat)
    }
}
