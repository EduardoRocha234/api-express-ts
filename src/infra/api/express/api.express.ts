import type { Api } from '../api'
import express, { type Express } from 'express'
import { createServer, Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import type { Route } from './routes/routes'

export class ApiExpress implements Api {
    private app: Express
    private server: HttpServer
    private io: SocketIOServer
    private allowedOrigins = ['http://localhost:3000', 'http://10.0.0.127:3000']

    private constructor() {
        this.app = express()
        this.server = createServer(this.app)
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: (origin, callback) => {
                    if (this.allowedOrigins.includes(origin!) || !origin) {
                        callback(null, true)
                    } else {
                        callback(new Error('Not allowed by CORS'))
                    }
                }
            }
        })

        this.app.use(express.json())
        this.setupSocketIO()
    }

    public static create() {
        return new ApiExpress()
    }

    public addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            const path = route.getPath()
            const method = route.getMethod()
            const handler = route.getHandler()
            const middlewares = route.getMiddlewares()

            this.app[method](path, ...middlewares, handler)
        })
    }

    public start(port: number): void {
        this.server.listen(port, () => console.log(`Server running on port ${port}`))
        this.listRoutes()
    }

    private listRoutes() {
        const routes = this.app._router.stack
            .filter((route: any) => route.route) // eslint-disable-line
            .map((route: any) => ({ // eslint-disable-line
                path: route.route.path,
                method: route.route.stack[0].method
            }))

        console.log(routes)
    }

    private setupSocketIO() {
        this.io.on('connection', (socket) => {
            console.log('A user connected:', socket.id)

            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id)
            })
        })
    }

    public getIO(): SocketIOServer {
        return this.io
    }
}
