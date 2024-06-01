import { PrismaClient } from '@prisma/client'
import type { UserGateway } from '@domain/user/gateway/user.gateway'
import { User } from '@domain/user/entity/user'

export class UserRepositoryPrisma implements UserGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new UserRepositoryPrisma(prismaClient)
    }

    public async save(user: User): Promise<void> {
        const { id, name, email, password } = user
        const data = {
            id,
            name,
            email,
            password
        }

        await this.prismaClient.user.create({
            data
        })
    }

    public async list(): Promise<User[]> {
        const users = await this.prismaClient.user.findMany()

        const usersList = users.map((user) => {
            const userWith = User.with({
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password
            })

            return userWith
        })

        return usersList
    }
}
