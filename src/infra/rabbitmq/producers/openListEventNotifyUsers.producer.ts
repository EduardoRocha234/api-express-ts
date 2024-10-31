import { RabbitMQClient } from '../rabbitmq-client'

export type OpenListEventsNotifyUsersMessage = {
    eventId: number
    datetime: Date
}

export class OpenListEventsNotifyUsersProducer {
    private constructor(private readonly rabbitMQClient: RabbitMQClient) {}

    public static create(rabbitmqClient: RabbitMQClient) {
        return new OpenListEventsNotifyUsersProducer(rabbitmqClient)
    }

    public async sendMessage(props: OpenListEventsNotifyUsersMessage) {
        const channel = await this.rabbitMQClient.createChannel()

        console.log('abre a fila')
        await channel.assertQueue('notify-user-open-list-event-queue', { durable: true })

        channel.publish('', 'notify-user-open-list-event-queue', Buffer.from(JSON.stringify(props)))
    }
}
