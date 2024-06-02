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

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id
            }
        })

        if (!user) return

        const aUser = User.with({
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password
        })

        return aUser
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email
            }
        })

        if (!user) return

        const aUser = User.with({
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password
        })

        return aUser
    }

    public async update(user: User): Promise<User> {
        const { id, name, email, password } = user
        const data = {
            id,
            name,
            email,
            password
        }

        const newUser = await this.prismaClient.user.update({
            where: {
                id
            },
            data
        })

        const aUser = User.with({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            password: newUser.password
        })

        return aUser
    }

    public async delete(id: string): Promise<void> {
        await this.prismaClient.user.delete({
            where: {
                id
            }
        })
    }
}
