// import { User } from '@domain/user/entity/user'
// import type { UserGateway } from '@domain/user/gateway/user.gateway'
// import type { BcryptAdapter } from '@infra/driven-adapter/bcrypt-adapter'
// import type { Usecase } from '../usecase'

// export type UpdateUserInputDto = {
//     id: string
//     name: string
//     email: string
// }

// export type UpdateUserOutputDto = {
//     id: string
//     name: string
//     email: string
// }

// export class CreateUserUsecase implements Usecase<UpdateUserInputDto, UpdateUserOutputDto> {
//     private constructor(
//         private readonly userGateway: UserGateway,
//     ) {}

//     public static create(userGateway: UserGateway) {
//         return new CreateUserUsecase(userGateway)
//     }

//     public async execute({
//         name,
//         email,
//         password
//     }: UpdateUserInputDto): Promise<CreateUserOutputDto> {
//         const passwordHashed = await this.bcryptAdapter.hash(password)
//         const aUser = User.create(name, email, passwordHashed)

//         await this.userGateway.save(aUser)

//         const output = this.presentOutput(aUser)

//         return output
//     }

//     private presentOutput(user: User): CreateUserOutputDto {
//         const output: CreateUserOutputDto = {
//             id: user.id,
//             name: user.name,
//             email: user.email
//         }

//         return output
//     }
// }
