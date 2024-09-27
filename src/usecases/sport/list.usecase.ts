import type { Usecase } from '../usecase'
import type { Sport, SportProps } from '@domain/sport/entity/sport.entity'
import type { SportGateway } from '@domain/sport/gateway/sport.gateway'

export type ListSportsOutputDto = {
    sports: SportProps[]
}

export class ListSportsUseCase implements Usecase<void, ListSportsOutputDto> {
    private constructor(private readonly sportGateway: SportGateway) {}

    public static create(sportGateway: SportGateway) {
        return new ListSportsUseCase(sportGateway)
    }

    public async execute(): Promise<ListSportsOutputDto> {
        const sports = await this.sportGateway.list()

        const output = this.presentOutput(sports)

        return output
    }

    private presentOutput(sport: Sport[]): ListSportsOutputDto {
        return {
            sports: sport.map((sport) => ({
                id: sport.id,
                name: sport.name,
                displayColor: sport.displayColor,
                displayIcon: sport.displayIcon
            }))
        }
    }
}
