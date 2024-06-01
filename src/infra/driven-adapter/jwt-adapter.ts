import jwt from 'jsonwebtoken'

export const secret = 'pYPKYp3kduyPXM71VjkaEIa7TMUfCFTF'

export class JwtAdapter {
    constructor() {}

    async encrypt(text: string | number | Buffer): Promise<string> {
        return jwt.sign({ account: text }, secret, { expiresIn: '1d' })
    }
}
