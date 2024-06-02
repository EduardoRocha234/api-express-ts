import { User } from '../entity/user'

export interface UserGateway {
    save(user: User): Promise<void>
    list(): Promise<User[]>
    findById(id: string): Promise<User | undefined>
    findByEmail(id: string): Promise<User | undefined>
    delete(id: string): Promise<void>
    update(user: User): Promise<User>
}
