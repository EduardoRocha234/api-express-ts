import amqp from 'amqplib'

export class RabbitMQClient {
    private connection: amqp.Connection | null = null
    private rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost'

    public static create() {
        return new RabbitMQClient()
    }

    // Estabelecer a conexão com o RabbitMQ
    public async connect() {
        console.log(this.rabbitmqUrl)
        if (!this.connection) {
            this.connection = await amqp.connect(this.rabbitmqUrl)
        }
        return this.connection
    }

    // Criar um canal de comunicação
    public async createChannel() {
        const connection = await this.connect()
        return connection.createChannel()
    }
}
