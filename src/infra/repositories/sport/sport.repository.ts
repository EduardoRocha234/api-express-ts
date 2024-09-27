import { PrismaClient } from '@prisma/client'
import { Sport } from '@domain/sport/entity/sport.entity'
import type { SportGateway } from '@domain/sport/gateway/sport.gateway'

export class SportRepositoryPrisma implements SportGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static create(prismaClient: PrismaClient) {
        return new SportRepositoryPrisma(prismaClient)
    }

    public async save(sport: Sport): Promise<Sport> {
        const sportCreated = await this.prismaClient.sport.create({
            data: sport
        })

        const aSport = Sport.with({
            id: sportCreated.id,
            name: sportCreated.name,
            displayColor: sportCreated.displayColor,
            displayIcon: sportCreated.displayIcon
        })

        return aSport
    }

    public async list(): Promise<Sport[]> {
        const sports = await this.prismaClient.sport.findMany()

        const sportsList = sports.map((sport) => {
            const sportWith = Sport.with({
                id: sport.id,
                name: sport.name,
                displayColor: sport.displayColor,
                displayIcon: sport.displayIcon
            })

            return sportWith
        })

        return sportsList
    }

    public async findById(id: number): Promise<Sport | undefined> {
        const sport = await this.prismaClient.sport.findUnique({
            where: {
                id
            }
        })

        if (!sport) return

        const aSport = Sport.with({
            id: sport.id,
            name: sport.name,
            displayColor: sport.displayColor,
            displayIcon: sport.displayIcon
        })

        return aSport
    }

    public async update(sport: Sport): Promise<Sport> {
        const newSportUpdated = await this.prismaClient.event.update({
            where: { id: sport.id },
            data: sport
        })

        const getSport = await this.findById(newSportUpdated.id)

        const aSport = Sport.with({
            id: getSport!.id,
            name: getSport!.name,
            displayColor: getSport!.displayColor,
            displayIcon: getSport!.displayIcon
        })

        return aSport
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.sport.delete({
            where: {
                id
            }
        })
    }
}
