import { RabbitMQClient } from '../rabbitmq-client'
import type { EventGateway } from '@domain/event/gateway/event.gateway'
import type { FirebaseAdminService } from '@package/firebase/fire-base-admin'
import type { OpenListEventsNotifyUsersMessage } from '../producers/openListEventNotifyUsers.producer'
import type { UserGateway } from '@domain/user/gateway/user.gateway'
import { dayJsTz } from '@package/dayjs/dayjs.config'
import type { EventNotificationsUsersGateway } from '@domain/eventNotificationsUsers/gateway/event-notifications-users.gateway'

export class OpenListEventNotifyUserConsumer {
    private constructor(
        private readonly rabbitMQClient: RabbitMQClient,
        private readonly firebaseService: FirebaseAdminService,
        private readonly userService: UserGateway,
        private readonly eventService: EventGateway,
        private readonly eventNotificationsUsersGateway: EventNotificationsUsersGateway
    ) {}

    public static create(
        rabbitmqClient: RabbitMQClient,
        firebaseService: FirebaseAdminService,
        userService: UserGateway,
        eventService: EventGateway,
        eventNotificationsUsersGateway: EventNotificationsUsersGateway
    ) {
        return new OpenListEventNotifyUserConsumer(
            rabbitmqClient,
            firebaseService,
            userService,
            eventService,
            eventNotificationsUsersGateway
        )
    }

    public async consumeMessages() {
        const channel = await this.rabbitMQClient.createChannel()

        // channel.prefetch(3)

        // Escuta a fila e processa as mensagens
        channel.consume('notify-user-open-list-event-queue', async (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString())
                const data = JSON.parse(msg.content.toString()) as OpenListEventsNotifyUsersMessage
                console.log(`notificaçoes: ${data.eventId}`)

                // const users = await this.eventNotificationsUsersGateway.getByEventId(event.id)

                // const user = await this.userService.findById(data.userId)
                // const event = await this.eventService.findById(data.eventId)

                const [users, event] = await Promise.all([
                    this.eventNotificationsUsersGateway.getByEventId(data.eventId),
                    this.eventService.findById(data.eventId)
                ])

                console.log(users)

                if (!users.length || !event) {
                    console.error('Não há usuários ou evento não encontrado')
                    channel.ack(msg)
                    return
                }

                const messageData = {
                    title: 'Corre para colocar seu nome na lista 👀',
                    body: `O evento ${event.name} já abriu a lista de participantes!`
                }

                if (dayJsTz(data.datetime).isAfter(dayJsTz().toDate())) {
                    console.log('aqui2')
                    setTimeout(async () => {
                        await Promise.all(
                            users.map((user) => {
                                console.log('aqui')
                                if (user.userPushToken) {
                                    console.log('aqui')
                                    return this.firebaseService.sendNotification(
                                        user.userPushToken,
                                        messageData
                                    )
                                }
                                return Promise.resolve()
                            })
                        )
                        channel.ack(msg)
                    }, dayJsTz(data.datetime).diff(dayJsTz().toDate()))
                } else {
                    console.log('aqui3')

                    await Promise.all(
                        users.map((user) => {
                            if (user.userPushToken) {
                                return this.firebaseService.sendNotification(
                                    user.userPushToken,
                                    messageData
                                )
                            }
                            return Promise.resolve()
                        })
                    )
                    channel.ack(msg)
                }
            }
        })
    }
}
