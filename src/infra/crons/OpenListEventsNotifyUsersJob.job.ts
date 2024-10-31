import cron from 'node-cron'
import type { OpenListEventsNotifyUsersProducer } from '@infra/rabbitmq/producers/openListEventNotifyUsers.producer'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import { dayJsTz } from '@package/dayjs/dayjs.config'

export class OpenListEventsNotifyUsersJob {
    private constructor(
        private readonly sendNotificationProducer: OpenListEventsNotifyUsersProducer,
        // private readonly eventNotificationsUsersGateway: EventNotificationsUsersGateway,
        private readonly eventsGateway: EventGateway
    ) {}

    public static create(
        sendNotificationProducer: OpenListEventsNotifyUsersProducer,
        // eventNotificationsUsersGateway: EventNotificationsUsersGateway,
        eventsGateway: EventGateway
    ) {
        return new OpenListEventsNotifyUsersJob(
            sendNotificationProducer,
            // eventNotificationsUsersGateway,
            eventsGateway
        )
    }

    public async execute() {
        // Cron que roda todos os dias às 00:00
        const cronExpression = `* * * * *`
        await this.scheduleRecurringEventCheck(cronExpression)
    }

    private async scheduleRecurringEventCheck(cronExpression: string) {
        cron.schedule(
            cronExpression,
            async () => {
                const initDate = dayJsTz().startOf('day').toDate()
                const endOfDay = dayJsTz().endOf('day').toDate()

                console.log({ initDate, endOfDay })

                const eventsToday = await this.eventsGateway.findByOpenParticipantListDate(
                    initDate,
                    endOfDay
                )
                console.log('teste')

                eventsToday.forEach(async (event) => {
                    console.log(event.id)
                    console.log('manda mensagem', {
                        datetime: dayJsTz(event.openParticipantsListDate).toDate(),
                        eventId: event.id,
                    })
                    await this.sendNotificationProducer.sendMessage({
                        datetime: dayJsTz(event.openParticipantsListDate).toDate(),
                        eventId: event.id
                    })
                })
            },
            {
                scheduled: true,
                timezone: 'America/Sao_Paulo'
            }
        )
    }
}
