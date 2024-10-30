import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { AppError } from "../Errors/AppError";
import { UserRepository } from "../Repositories/user.repository";
import bcrypt from "bcrypt";
import jose from "jose";


export class UserService {
    private _userRepository = new UserRepository
    private hashSaltRounds = 10

    async createUser(data: CreateUserDto) {
        await this.ensureUserDoesNotExistByEmail(data.email)

        const password = await this.generateHash(data.password)

        return await this._userRepository.create({ ...data, password })
    }

    async getAllUsers() {
        return await this._userRepository.findMany()
    }

    async getUserById(id: number) {
        await this.ensureUserExistById(id)
        return await this._userRepository.findById(id)
    }

    async updateUserById(id: number, data: UpdateUserDto) {
        await this.ensureUserExistById(id)
        return await this._userRepository.updateById(id, data)
    }

    async deleteUserById(id: number) {
        await this.ensureUserExistById(id)
        return await this._userRepository.deleteById(id)
    }

    async ensureUserExistById(id: number) {
        const user = await this._userRepository.findById(id)
        if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND")
    }

    async authenticateUser(email: string, password: string) {
        const user = await this.getUserByEmail(email)
        await this.verifyHash(password, user.password)

        const payload = { id: user.id, email: user.email }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret")
        const alg = 'HS256'

        const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(`http://localhost:3000`)
        .setSubject('users')
        .setExpirationTime('1h')
        .sign(secret)

        return token
    }

    private async ensureUserDoesNotExistByEmail(email: string) {
        const existingUser = await this._userRepository.findByEmail(email)
        if (existingUser) throw new AppError("Email already in use", 409, "EMAIL_ALREADY_IN_USE")
    }

    private async generateHash(word: string) {
        return await bcrypt.hash(word, this.hashSaltRounds)
    }

    private async verifyHash(word: string, hashedPassword: string) {
        const comparePasswords = await bcrypt.compare(word, hashedPassword)
        if (!comparePasswords) throw new AppError("Password incorrect", 400, "PASSWORD_INCORRECT")
        return comparePasswords
    }

    private async getUserByEmail(email: string) {
        const user = await this._userRepository.findByEmail(email)
        if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND")
        return user
    }


}