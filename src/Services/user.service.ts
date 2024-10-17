import { UserRepository, IDataUser } from "../Repositories/user.repository";


export class UserService {
    private _userRepository = new UserRepository

    async createUser(data: IDataUser) {
        return await this._userRepository.create(data);
    }

    async getAllUsers() {
        return await this._userRepository.findMany();
    }

    async getUserById(id:number) {
        return await this._userRepository.findById(id);
    }

    async updateUserById(id: number, data: IDataUser) {
        const userToDelete = await this.getUserById(id)
        if (!userToDelete){
            throw new Error("User not found")
        }
        return await this._userRepository.updateById(id, data);
    }

    async deleteUserById(id: number) {
        const userToDelete = await this.getUserById(id)
        if (!userToDelete){
            throw new Error("User not found")
        }
        return await this._userRepository.deleteById(id);
    }
}