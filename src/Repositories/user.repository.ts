import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto"
import user from "../Entities/users.entity"



export class UserRepository {

    async create(data: CreateUserDto) {
        return await user.create({ data })
    }

    async findMany() {
        return await user.findMany()
    }

    async findById(id: number) {
        return await user.findUnique({
            where: { id }
        })
    }

    async findByEmail(email: string) {
        return await user.findUnique({
            where: { email }
        })
    }

    async updateById(dto: UpdateUserDto) {
        const { id, ...data } = dto
        return await user.update({
            where: { id },
            data
        })
    }

    async deleteById(id: number) {
        return await user.delete({
            where: { id }
        }
        )
    }

}
