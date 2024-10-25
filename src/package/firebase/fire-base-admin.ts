import admin, { type ServiceAccount } from 'firebase-admin'
import serviceAccount from '../../../fire-base-keys.json' // Adicione o caminho para o arquivo de conta do serviço Firebase

export class FirebaseAdminService {
    private messaging: admin.messaging.Messaging

    private constructor() {
        // Inicialize o Firebase Admin com credenciais de serviço
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount)
        })

        this.messaging = admin.messaging()
    }

    public static initFireBaseService() {
        return new FirebaseAdminService()
    }

    public async sendNotification(token: string, payload: { title: string; body: string }) {
        try {
            const message = {
                notification: {
                    title: payload.title,
                    body: payload.body
                },
                token: token
            }  

            console.log('aqui', { message})

            await this.messaging.send(message)
            console.log('Notification sent successfully')
        } catch (error) {
            console.error('Error sending notification:', error)
        }
    }
}
