import { RabbitMQClient } from '../rabbitmq-client'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import { EdaysOfWeek, Event } from '@domain/event/entity/event.entity'
import dayjs from 'dayjs'

export class EventConsumer {
    private constructor(
        private readonly rabbitMQClient: RabbitMQClient,
        private readonly eventGateway: EventGateway
    ) {}

    public static create(rabbitmqClient: RabbitMQClient, eventGateway: EventGateway) {
        return new EventConsumer(rabbitmqClient, eventGateway)
    }

    public async consumeMessages() {
        const channel = await this.rabbitMQClient.createChannel()

        channel.prefetch(5)

        // Escuta a fila e processa as mensagens
        channel.consume('recurring-events-queue', async (msg) => {
            if (msg !== null) {
                const dayToProcess = msg.content.toString()
                // console.log(`Processando eventos recorrentes para o dia: ${dayToProcess}`)

                // Chama a função para criar os eventos recorrentes
                await this.createRecurringEventsForDay(dayToProcess)

                channel.ack(msg) // Marca a mensagem como processada
            }
        })
    }

    private async createRecurringEventsForDay(day: string) {
        const weekDay = dayjs(day).day()
        const dayName = EdaysOfWeek[weekDay] as keyof typeof EdaysOfWeek

        const eventsToRepeat = await this.eventGateway.findRecurringEventsByDay(dayName)
        const mappedEvents = this.mapEvents(eventsToRepeat)

        await this.eventGateway.saveMany(mappedEvents)
    }

    private mapEvents(events: Event[]) {
        return events.map((event) => {
            const updatedOpenListDate = this.calculateOpenParticipantsListDate(
                event.openParticipantsListDate,
                event.recurringDay,
                event.daysBeforeOpeningList!
            )

            return Event.create(
                0,
                event.name,
                event.sportId,
                event.maxParticipants,
                event.location,
                new Date(),
                event.startTime,
                event.endTime,
                updatedOpenListDate,
                event.maxOfParticipantsWaitingList,
                event.adminId,
                null,
                event.description,
                null
            )
        })
    }

    private calculateOpenParticipantsListDate(
        openParticipantsListDate: Date | null,
        recurringDay: keyof typeof EdaysOfWeek | null,
        daysBeforeOpeningList: number
    ): Date | null {
        if (!openParticipantsListDate || !recurringDay) return null

        const openDate = dayjs(openParticipantsListDate)
        const currentDate = dayjs()

        const updatedDate = currentDate
            .subtract(daysBeforeOpeningList, 'day')
            .hour(openDate.hour())
            .minute(openDate.minute())
            .second(openDate.second())

        return updatedDate.toDate()
    }
}
