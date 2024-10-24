import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { AppError } from "../Errors/AppError";
import { UserRepository } from "../Repositories/user.repository";


export class UserService {
    private _userRepository = new UserRepository

    async createUser(data: CreateUserDto) {
        return await this._userRepository.create(data);
    }

    async getAllUsers() {
        return await this._userRepository.findMany();
    }

    async getUserById(id: number) {
        await this.userExist(id)
        return await this._userRepository.findById(id);
    }

    async updateUserById(id: number, data: UpdateUserDto) {
        await this.userExist(id)
        return await this._userRepository.updateById(id, data);
    }

    async deleteUserById(id: number) {
        await this.userExist(id)
        return await this._userRepository.deleteById(id);
    }

    async userExist(id: number) {
        const user = await this._userRepository.findById(id)
        if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND")

    }
}