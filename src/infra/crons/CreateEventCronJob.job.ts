import { type EventProps } from '@domain/event/entity/event.entity'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import cron from 'node-cron'
import dayjs from 'dayjs'
import type { EventProducer } from '@infra/rabbitmq/producers/event.producer'

export type CreateEventInputDto = Omit<EventProps, 'id' | 'participants' | 'createdAt'>
export type CreateEventOutputDto = Omit<EventProps, 'participants'>

export class CreateEventsCronJob {
    private constructor(
        private readonly eventGateway: EventGateway,
        private readonly eventProducer: EventProducer
    ) {}

    public static create(eventGateway: EventGateway, eventProducer: EventProducer) {
        return new CreateEventsCronJob(eventGateway, eventProducer)
    }

    public async execute() {
        // Cron que roda todos os dias às 00:00
        const cronExpression = `0 0 * * Mon,Tue,Wed,Thu,Fri,Sat,Sun`
        await this.scheduleRecurringEventCheck(cronExpression)
    }

    private async scheduleRecurringEventCheck(cronExpression: string) {
        cron.schedule(
            cronExpression,
            async () => {
                const today = dayjs().format('YYYY-MM-DD')
                console.log('teste')
                await this.eventProducer.sendMessage(today)
            },
            {
                scheduled: true,
                timezone: 'America/Sao_Paulo'
            }
        )
    }
}
