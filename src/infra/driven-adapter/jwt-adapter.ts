import jwt from 'jsonwebtoken'

export const secret = 'pYPKYp3kduyPXM71VjkaEIa7TMUfCFTF'

export type PayloadToken = {
	account: string
	iat: number
	exp: number
}

export type PayloadSign = {
    name: string
    email: string
    exp: number
}
export class JwtAdapter {
    constructor() {}

    async encrypt(text: string | number | Buffer): Promise<string> {
        return jwt.sign({ account: text }, secret, { expiresIn: '1d' })
    }

    async decript(token: string): Promise<string | jwt.JwtPayload> {
        return jwt.verify(token, secret)
    }
}
