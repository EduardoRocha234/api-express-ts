import type { EventGateway } from '@domain/event/gateway/event.gateway'
import cron from 'node-cron'
import type { EventProducer } from '@infra/rabbitmq/producers/event.producer'
import { dayJsTz } from '@package/dayjs/dayjs.config'

export class CreateEventsCronJob {
    private constructor(
        private readonly eventProducer: EventProducer
    ) {}

    public static create(eventGateway: EventGateway, eventProducer: EventProducer) {
        return new CreateEventsCronJob( eventProducer)
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
                const today = dayJsTz().format('YYYY-MM-DD')
                await this.eventProducer.sendMessage(today)
            },
            {
                scheduled: true,
                timezone: 'America/Sao_Paulo'
            }
        )
    }
}
