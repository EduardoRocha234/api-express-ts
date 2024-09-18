import type { Sport } from "../entity/sport.entity"

export interface SportGateway {
    save(sport: Sport): Promise<Sport>
    list(): Promise<Sport[]>
    findById(id: number): Promise<Sport | undefined>
    delete(id: number): Promise<void>
    update(sport: Sport): Promise<Sport>
}
