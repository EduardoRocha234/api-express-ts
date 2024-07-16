import { JwtAdapter, type PayloadToken } from '@infra/driven-adapter/jwt-adapter'
import type { NextFunction, Request, Response } from 'express'

export class AuthMiddleware {
    private constructor(private readonly jwtAdapter: JwtAdapter) {}

    public static create(jwtAdapter: JwtAdapter) {
        return new AuthMiddleware(jwtAdapter).handler()
    }

    private handler() {
        return async (request: Request, response: Response, next: NextFunction) => {
            const authToken = request.headers['authorization']

            if (!authToken) {
                this.errorUnauthorized(response, 'Token de autenticação não fornecido')
                return
            }

            const tokenWithoutBearer = this.extractToken(authToken)

            if (!tokenWithoutBearer) {
                this.errorUnauthorized(response, 'Formato de token inválido')
                return
            }

            try {
                const decoded = (await this.jwtAdapter.decript(tokenWithoutBearer)) as PayloadToken
                const user = this.parseToken(decoded)

                if (!user) {
                    this.errorUnauthorized(response, 'Token inválido')
                    return
                }

                ;(request as any).user = { email: user.email }  // eslint-disable-line

                next()
            } catch (error) {
                console.error('Erro na autenticação:', error)
                this.errorUnauthorized(response, 'Usuário não autenticado')
                return
            }
        }
    }

    private extractToken(authHeader: string): string | null {
        const parts = authHeader.split(' ')

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null
        }

        return parts[1]
    }

    private parseToken(token: PayloadToken) {
        try {
            return JSON.parse(token.account)
        } catch (error) {
            console.error('Erro ao parsear o token:', error)
            return null
        }
    }

    private errorUnauthorized(response: Response, message: string) {
        response.status(401).send(message)
    }
}
