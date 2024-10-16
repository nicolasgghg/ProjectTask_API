import user from "../Entities/users.entity"

export interface IDataUser {
    name: string
    email: string
    password: string
}

export class UserRepository {

    async create(data: IDataUser) {
        return await user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        })
    }

    async findMany() {
        return await user.findMany()
    }

    async findById(id: number) {
        return await user.findUnique({
            where: { id }
        })
    }

    async updateById(id: number, data: IDataUser) {
        return await user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                password: data.password
            }
        })
    }

    async deleteById(id: number) {
        return await user.delete({
            where: { id }
        }
        )
    }

}
