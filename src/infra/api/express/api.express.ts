import type { Api } from '../api'
import express, { type Express } from 'express'
import type { Route } from './routes/routes'

export class ApiExpress implements Api {
    private app: Express

    private constructor(routes: Route[]) {
        this.app = express()
        this.app.use(express.json())
        this.addRoutes(routes)
    }

    public static create(routes: Route[]) {
        return new ApiExpress(routes)
    }

    private addRoutes(routes: Route[]) {
        routes.forEach((route) => {
            const path = route.getPath()
            const method = route.getMethod()
            const handler = route.getHandler()
            const middlewares = route.getMiddlewares()

            this.app[method](path, ...middlewares, handler)
        })
    }

    public start(port: number): void {
        this.app.listen(port, () => console.log(`Server running on port ${port}`))
        this.listRoutes()
    }

    private listRoutes() {
        const routes = this.app._router.stack
            .filter((route: any) => route.route)
            .map((route: any) => {
                return {
                    path: route.route.path,
                    method: route.route.stack[0].method
                }
            })

        console.log(routes)
    }
}
