import bcrypt from 'bcrypt'

export class BcryptAdapter {
    private readonly salt: number = 12

    constructor() {}

    async compare(text: string, verify: string): Promise<boolean> {
        return await bcrypt.compare(text, verify)
    }

    async hash(text: string): Promise<string> {
        return await bcrypt.hash(text, this.salt)
    }
}
