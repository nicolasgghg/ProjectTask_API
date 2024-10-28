import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { AppError } from "../Errors/AppError";
import { UserRepository } from "../Repositories/user.repository";
import bcrypt from "bcrypt"


export class UserService {
    private _userRepository = new UserRepository
    private hashSaltRounds = 10

    async createUser(data: CreateUserDto) {
        await this.ensureUserExistsByEmail(data.email)

        const password = await this.generateHash(data.password)

        return await this._userRepository.create({ ...data, password });
    }

    async getAllUsers() {
        return await this._userRepository.findMany();
    }

    async getUserById(id: number) {
        await this.ensureUserExistById(id)
        return await this._userRepository.findById(id);
    }

    async updateUserById(id: number, data: UpdateUserDto) {
        await this.ensureUserExistById(id)
        return await this._userRepository.updateById(id, data);
    }

    async deleteUserById(id: number) {
        await this.ensureUserExistById(id)
        return await this._userRepository.deleteById(id);
    }

    async ensureUserExistById(id: number) {
        const user = await this._userRepository.findById(id)
        if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND")
    }

    private async ensureUserExistsByEmail(email: string) {
        const existingUser = await this._userRepository.findByEmail(email)
        if (existingUser) throw new AppError("Email has already been registered", 409, "EMAIL_ALREADY_REGISTERED");
    }

    private async generateHash(word: string) {
        return await bcrypt.hash(word, this.hashSaltRounds);
    }

    private async verifyHash(word: string, hashedPassword: string) {
        return await bcrypt.compare(word, hashedPassword);
      }
}