import { RabbitMQClient } from '../rabbitmq-client'

export class EventProducer {
    private constructor(private readonly rabbitMQClient: RabbitMQClient) {}

    public static create(rabbitmqClient: RabbitMQClient) {
        return new EventProducer(rabbitmqClient)
    }

    public async sendMessage(message: string) {
        const channel = await this.rabbitMQClient.createChannel()

        await channel.assertQueue('recurring-events-queue', { durable: true })

        const send = channel.publish('', 'recurring-events-queue', Buffer.from(message))

        console.log(send)
    }
}
